import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from '@services/common.service';
import {EventBusService} from '@services/event-bus.service';
import {environment} from '../../../../environments/environment';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {NgForm} from '@angular/forms';
import {PersonalCenterService} from './personal-center.service';
import {AuthService} from '@services/auth.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit, AfterViewInit, OnDestroy {

  // entUser: boolean = true;  //企业用户信息 true 显示
  private timestamp: number; // 生成图片验证码时的时间戳
  public captchaUrl = environment.apiBase + '/uc/captcha'; // 验证码图片初始化
  roleType: any;
  msgBindWeChatError: any;
  msgBindWeChatSuccess: any;
  isDisabledButton = true; // 校验修改姓名按钮
  isPasswordDisabledButton = true; // 校验修改登录密码按钮
  isSipPasswordDisabledButton = true; // 校验修改Sip密码按钮
  isRelievePhoneDisabledButton = true; // 校验修改手机按钮
  unEditNameForm: any; // 订阅的对象
  unUserPassForm: any; // 订阅的对象
  unSipPassForm: any; // 订阅的对象
  unRelievePhoneForm: any; // 订阅的对象

  /* 异步手机号和邮箱 */
  asyncValidtorBool = {
    isDisabledButton: null, // 判断重复禁用保存
    mobilePhoneRepeat: false // 判断手机号是否重复
  };

  // 测试数据
  personalData: any = {
    'user': {
      'activateStatus': 1,
      'apiUserId': '',
      'createTime': '',
      'deleteFlag': 0,
      'deptId': 0,
      'email': '',
      'isBinding': 0,
      'isBlocked': false,
      'mobilePhone': '',
      'orgId': 0,
      'company': '',
      'password': '',
      'realName': '',
      'roleId': 0,
      'subdeptId': 0,
      'threedeptId': 0,
      'userId': '',
      'userType': 0,
      'verifyNumber': '',
      'deptName': '',
      'subdeptName': '',
      'threedeptName': '',
      'empno': ''
    },
    'sipList': {
      'assignedTime': '',
      'assigneeUserId': '',
      'assignorUserId': '',
      'entId': '',
      'entName': '',
      'isFrozen': 0, 'isRecovered': 0, 'sipDomain': '',
      'sipNumber': 0, 'sipPassword': '', 'sipServer': ''
    }
  };

  constructor(private router: Router,
              private http: HttpClient,
              private commonService: CommonService,
              private _eventBus: EventBusService,
              private personalCenterService: PersonalCenterService,
              private authService: AuthService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
  }

  public loginUserData = this.commonService.getLoginMsg();
  userId: any = this.loginUserData.userId;

  @ViewChild('editNameForm') editNameForm: NgForm;
  @ViewChild('userPassForm') userPassForm: NgForm;
  @ViewChild('sipPassForm') sipPassForm: NgForm;
  @ViewChild('relievePhoneForm') relievePhoneForm: NgForm;

  ngOnInit() {
    this.roleType = this.loginUserData.roleType;
    this.getUserList();
    this.changeImg();
    this.msgBindWeChatError = this.decodeUTF8(this.commonService.getCookie('bindWeChatError'));
    if (this.msgBindWeChatError) {
      this._notification.create('error', this.msgBindWeChatError, '');
      this.commonService.deleCookie('bindWeChatError');
    }
    this.msgBindWeChatSuccess = this.decodeUTF8(this.commonService.getCookie('bindWeChatSuccess'));
    if (this.msgBindWeChatSuccess) {
      this._notification.create('success', this.msgBindWeChatSuccess, '');
      this.commonService.deleCookie('bindWeChatSuccess');
    }
  }

  ngAfterViewInit() {
    this.unEditNameForm = this.editNameForm.valueChanges
      .debounceTime(500)
      .subscribe(value => {
        this.onValueChanged(value);
      });

    // 订阅修改用户密码改变事件
    this.unUserPassForm = this.userPassForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onPasswordValueChanged(data);
      });
    // 订阅修改用户密码改变事件
    this.unSipPassForm = this.sipPassForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onSipPasswordValueChanged(data);
      });
    // 订阅修改手机改变事件
    this.unRelievePhoneForm = this.relievePhoneForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onRelievePhoneValueChanged(data);
      });
  }

  ngOnDestroy() {
    // 销毁组件时清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.unEditNameForm.unsubscribe();
    this.unUserPassForm.unsubscribe();
    this.unSipPassForm.unsubscribe();
    this.unRelievePhoneForm.unsubscribe();
  }

  // 修改姓名输入
  onValueChanged(data) {
    if (data === '') {
      this.isDisabledButton = false;
    } else {
      this.isDisabledButton = this.editNameForm.valid;
    }
  }

  // 修改登录密码输入
  onPasswordValueChanged(data) {
    this.isPasswordDisabledButton = this.userPassForm.valid;
  }

  // 修改Sip密码输入
  onSipPasswordValueChanged(data) {
    this.isSipPasswordDisabledButton = this.sipPassForm.valid;
  }

  // 修改手机输入
  onRelievePhoneValueChanged(data) {
    this.isRelievePhoneDisabledButton = this.relievePhoneForm.valid;
    if (this.isUpdatePhone) {
      if (this.relievePhoneForm.controls.mobilePhone) {
        if (!this.relievePhoneForm.controls.mobilePhone.errors) {  // 验证手机表单选项唯一
          this.getMobilePhoneRepeat(data.mobilePhone);
        }
      }
    }
  }

  // 解码utf8
  decodeUTF8(str) {
    if (str) {
      return str.replace(/(\\u)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
        return String.fromCharCode(parseInt($2, 16));
      });
    } else {
      return '';
    }
  }

  //获取个人信息
  getUserList() {
    this.personalCenterService.getUserList(this.userId).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.personalData.user.realName = datalist.data.realName; // 姓名
          this.personalData.user.company = datalist.data.company; // 公司单位
          this.personalData.user.empno = datalist.data.empno; //工号
          this.personalData.user.position = datalist.data.position; //职务
          this.personalData.user.email = datalist.data.email; // 邮箱
          this.personalData.user.mobilePhone = datalist.data.mobilePhone;  //手机号
          this.personalData.sipList.sipNumber = datalist.data.sipNumber; // sip账号
          this.personalData.sipList.sipPassword = datalist.data.sipPassword; //sip密码
          this.personalData.user.userType = datalist.data.userType;  // 判断是否个人还是会议室
          this.personalData.user.deptName = datalist.data.deptName;
          this.personalData.user.subdeptName = datalist.data.subdeptName;
          this.personalData.user.threedeptName = datalist.data.threedeptName;
          this.personalData.user.orgId = datalist.data.orgId;
          this.personalData.user.isBindWechat = datalist.data.isBindWechat;

        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //修改姓名
  updateNameModal = false;
  updateRealName: any = '';  //修改姓名
  updateNameFn(name: any) {
    this.updateRealName = name;
    this.updateNameModal = true;
  }

  // 确定修改姓名
  saveEditRealName() {
    const getData = {
      realName: this.updateRealName,
      userId: this.userId
    };
    this.personalCenterService.saveEditRealName(getData).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.updateNameModal = false;
          this.getUserList();
          this._notification.create('success', '修改成功', '');
          this.loginUserData.realName = this.updateRealName;
          this._eventBus.editRealNameFn.next(this.updateRealName);
          localStorage.setItem('uc_loginData', JSON.stringify(this.loginUserData));//重新设置本地存储
        } else {
          this._notification.create('error', '修改失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // 修改手机号
  updateNumberIphoneModal = false;

  updateNumberIphoneFn() {
    this.updateNumberIphoneModal = true;
  }

  // 获取短信验证码
  messCodeError: any;

  getPhoneCode() {
    const getData = {
      mobile: this.oldPhone ? this.oldPhone : this.personalData.user.mobilePhone,
      type: 4
    };
    if (getData.mobile) {
      this.sendMessage(); //倒计时
      this.personalCenterService.getPhoneCode(getData).subscribe(
        res => {
          const resData: any = res;
          if (+resData.code !== 200) {
            this.messCodeError = resData.msg;
          }
        },
        err => {
          console.log(err);
        });
    } else {
      this.messCodeError = '手机号不能为空';
    }

  }

  /*
    获取验证码 倒计时定时器
  */
  private timer;
  private paracont = '获取验证码';
  private disabledClick = false;

  sendMessage() {
    let second = 60;
    this.timer = setInterval(() => {
      this.disabledClick = true;
      if (second <= 0) {
        clearInterval(this.timer);
        second = 60;
      } else {
        second--;
        this.paracont = second + '秒后可重发';
        if (second == 0) {
          this.paracont = '获取验证码';
          this.disabledClick = false;
        }
      }
    }, 1000, 60);
  }

  // 切换验证码
  oImgSrc: string;

  changeImg() {
    this.timestamp = (new Date()).valueOf();
    this.oImgSrc = this.captchaUrl + '/' + this.timestamp;
  }

  // 绑定修改手机号
  oldPhone: any = ''; //新手机号
  isUpdatePhone = false; //true为 绑定新手机号
  phoneCode: any = '';  //手机号验证码
  imgCode: any = ''; //图片验证码
  relievePhone() {
    if (!this.isUpdatePhone) {
      // 校验手机号验证码
      const getData = {
        picCode: this.phoneCode,
        msgCode: this.imgCode,
        randomStr: this.timestamp
      };
      this.personalCenterService.relieveEditPhone(this.personalData.user.mobilePhone, getData).subscribe(
        res => {
          const datalist: any = res;
          if (+datalist.code === 200) {
            // 验证成功 改为true
            this.isUpdatePhone = true;
            this.phoneCode = '';
            this.imgCode = '';
          } else {
            this._notification.create('error', datalist.msg, '');
          }
        },
        err => {
          this._notification.create('error', err.error.msg, '');
          console.log(err);
        }
      );
    } else {
      // 绑定新手机号
      const getData = {
        picCode: this.phoneCode,
        msgCode: this.imgCode,
        randomStr: this.timestamp
      };
      this.personalCenterService.relieveNewPhone(this.oldPhone, getData).subscribe(
        res => {
          const datalist: any = res;
          if (+datalist.code === 200) {
            this.isUpdatePhone = false;
            this.updateNumberIphoneModal = false;
            this.phoneCode = '';
            this.imgCode = '';

            this.getUserList();
            this._notification.create('success', '绑定成功', '');
          } else {
            this._notification.create('error', '绑定失败', '');
          }
        },
        err => {
          console.log(err);
        }
      );
    }
    clearInterval(this.timer);
    this.paracont = '获取验证码';
  }

  //退出企业
  // deleteModal: boolean = false;
  // quitEntModal: boolean = false;
  quitEntFn = () => {
    if (+this.roleType === 1 || +this.roleType === 2) { // routerLink="/page/change-admin"
      this.confirmServ.confirm({
        title: '退出',
        content: '请先更换企业管理员身份才可退出企业',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          await this.router.navigate(['/page/change-admin']);
        },
        onCancel() {
        }
      });
    } else {
      this.confirmServ.confirm({
        title: '退出',
        content: '退出企业后，当前账号更改为个人用户账号，是否确认退出？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          await this.saveQuitEntFn();
        },
        onCancel() {
        }
      });
    }
  };

  // 确定退出
  saveQuitEntFn() {
    this.personalCenterService.saveQuitEntFn(this.userId).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          // this.quitEntModal = false
          this.getUserList();
          this._notification.create('success', '退出成功', '');
          this.commonService.deletAllLoginData();//清除cookies，localStorage，并返回登录
        } else {
          this._notification.create('error', '退出失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //绑定微信
  bindWeChatModal = false;

  bindWeChatFn() {
    this.bindWeChatModal = true;
    this.personalCenterService.bindWeChatFn().subscribe(
      res => {
        const resData: any = res;
        const wxLoginData: any = {
          id: 'login_container',
          appid: resData.data.appId,
          scope: resData.data.scope,
          redirect_uri: encodeURIComponent(resData.data.redirectUri),
          state: resData.data.state,
          style: 'black',
          href: ''
        };
        this.WxLogin(wxLoginData);
      },
      err => {
        console.log(err);
      });
  }

  WxLogin(a: any) {
    let c = 'default';
    a.self_redirect === !0 ? c = 'true' : a.self_redirect === !1 && (c = 'false');
    let d = document.createElement('iframe'),
      e = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + a.appid + '&scope=' + a.scope + '&redirect_uri=' + a.redirect_uri + '&state=' + a.state + '&login_type=jssdk&self_redirect=' + c;
    e += a.style ? '&style=' + a.style : '', e += a.href ? '&href=' + a.href : '', d.src = e, d.frameBorder = '0', d.scrolling = 'no', d.width = '300px', d.height = '400px';
    let f = document.getElementById(a.id);
    f.innerHTML = '', f.appendChild(d);
  }

  //解绑微信
  unBindWeChatFn() {
    this.confirmServ.confirm({
      title: '解绑',
      content: '是否确定解除当前已绑定微信？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.unBindWeChat();
      },
      onCancel() {
      }
    });
  }

  // 确定解绑微信
  unBindWeChat() {
    this.personalCenterService.unBindWeChat().subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this._notification.create('success', '解绑成功', '');
          this.personalData.user.isBindWechat = 0;
        }
      },
      err => {
        this._notification.create('error', '解绑未成功', '');
        console.log(err);
      });
  }

  //修改登录密码
  PassWord: any = {
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
    userId: this.userId
  };
  psdErrorMsg = '';
  userPsdModal = false;

  updatePsdFn() {
    this.userPsdModal = true;
  }

  // 确定修改登录密码
  saveEditPw() {
    this.personalCenterService.saveEditPw(this.PassWord).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.userPsdModal = false;
          this._notification.create('success', '修改成功', '');
        } else if (+datalist.code === 32601) {
          this._notification.create('error', '原密码输入错误', '');
        } else {
          // this.userPsdModal = false;
          // this._notification.create('error', '修改失败', '');
          this.psdErrorMsg = datalist.msg;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //修改sip密码
  SipPassWord: any = {
    oldPwd: '',  //当前密码
    newPwd: '',  //新密码
    verifyPwd: '', //重复新密码
    sipNumber: 0
  };
  SIPpsdModal = false;

  updateSipPsdFn() {
    this.SIPpsdModal = true;
  }

  // 确定修改Sip密码
  saveEditSIP() {
    this.SipPassWord.sipNumber = this.personalData.sipList.sipNumber;
    this.personalCenterService.saveEditSIP(this.SipPassWord).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.SIPpsdModal = false;
          this.getUserList();
          this._notification.create('success', '修改成功', '');
        } else {
          this.SIPpsdModal = false;
          this._notification.create('success', '修改失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /**************验证器***************/

  // 企业名称或邮箱或手机号重复时对保存的禁用
  setDisabledButton() {
    this.asyncValidtorBool.isDisabledButton = this.asyncValidtorBool.mobilePhoneRepeat;
  }

  // 手机重复验证
  getMobilePhoneRepeat(value) {
    this.authService.validationPhone(value).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.asyncValidtorBool.mobilePhoneRepeat = false;
          this.setDisabledButton();
        } else {
          this.asyncValidtorBool.mobilePhoneRepeat = true;
          this.setDisabledButton();
        }
      },
      err => {
        console.log(err);
      });
  }

}
