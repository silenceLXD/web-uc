import {Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {CommonService} from '@services/common.service';
import {TimerButtonComponent} from '../../layout/timer-button.component';
import {NzNotificationService} from 'ng-zorro-antd';
import {BindPhoneService} from "./bind-phone.service";

@Component({
  selector: 'app-bind-phone',
  templateUrl: './bind-phone.component.html',
  styleUrls: ['./bind-phone.component.css']
})
export class BindPhoneComponent implements OnInit, OnDestroy {
  private sub: any;
  private userId: any;
  nowDate: any;
  // 提交表单信息
  bindData: any = {
    mobilePhone: '', // 手机
    verificationCode: '', // 验证码（ACCOUNT_BIND(1,"账号绑定",300),）
    isBinding: 1, // 绑定或解绑（1：绑定，0：解绑）
    password: '', // 密码
    openId: '',
    userId: '',
    realName: ''
  };
  // 微信有密码的
  bindDataHasPassword: any = {
    mobile: '', // 手机
    verificationCode: '', // 验证码（ACCOUNT_BIND(1,"账号绑定",300),）
    isBinding: 1, // 绑定或解绑（1：绑定，0：解绑）
    password: '', // 密码
    openId: '',
    userId: '',
    wxNickName: '',
    pushToken: '',
    notificationToken: ''
  };
  // 微信无密码的
  bindDataNoPassword: any = {
    mobile: '', // 手机
    verificationCode: '', // 验证码（ACCOUNT_BIND(1,"账号绑定",300),）
    openId: '',
    pushToken: '',
    notificationToken: ''
  };

  passwordValidators = false; // 提交时提示密码不会空

  errorMsg = ''; // 接口成功 code不为200时的错误提示
  isDisabledBind = false; // 提交按钮是否可用

  loginUserData: any; // 获取的数据
  oldPhoneNum: any; // 旧手机号

  // 检验手机号格式及唯一性
  checkPhoneMsg: any = {
    isCan: false,
    msg: ''
  };

  constructor(private http: HttpClient,
              private router: Router,
              private _activatedRoute: ActivatedRoute,
              private _notification: NzNotificationService,
              private authService: AuthService,
              private bindPhoneService: BindPhoneService,
              private commonService: CommonService) {
    this.nowDate = new Date().getFullYear();
  }

  @ViewChild(TimerButtonComponent) timerButton: TimerButtonComponent;

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
    });
    if (+this.userId !== 0) {
      this.checkPhoneMsg.isCan = true;
    }
    this.getUserData(this.userId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // 密码输入
  passwordInput() {
    this.passwordValidators = this.bindDataHasPassword.password === '';
  }

  // 验证码输入
  bindDataInput() {
    this.errorMsg = '';
  }

  // 确定提交
  sureBind() {
    if (this.bindDataHasPassword.verificationCode === '') {
      this._notification.create('error', '请输入验证码！', '');
    } else {
      if (+this.userId === 0) {
        if (this.checkPhoneMsg.isCan) {
          this.sureBindHasPassword();
        } else {
          this.sureBindPassword();
        }
      } else {
        this.sureBindPhone();
      }
    }
  }

  // 首次登陆 没密码的
  sureBindPassword() {
    this.bindDataNoPassword.openId = this.commonService.getCookie('openId');
    this.bindDataNoPassword.verificationCode = this.bindDataHasPassword.verificationCode;
    this.bindDataNoPassword.mobile = this.bindDataHasPassword.mobile;
    this.bindPhoneService.sureBindPassword(this.bindDataNoPassword).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this.weChatLoginFn();
        } else {
          this.errorMsg = resData.msg;
        }
      },
      err => {
        console.log(err);
      });
  }

  // 首次登陆，绑定手机和修改默认密码 有密码的
  sureBindHasPassword() {
    this.bindDataHasPassword.userId = this.userId;
    if (+this.userId === 0) {
      this.bindDataHasPassword.openId = this.commonService.getCookie('openId');
      this.bindDataHasPassword.wxNickName = this.commonService.decodeUTF8(this.commonService.getCookie('nickName'));
    }
    this.bindPhoneService.sureBindHasPassword(this.bindDataHasPassword).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          if (+this.userId === 0 && this.bindDataHasPassword.openId) { // 微信扫码登录
            this.weChatLoginFn();
          } else {
            this.router.navigateByUrl('page');
          }
        } else {
          this.errorMsg = resData.msg;
        }
      },
      err => {
        console.log(err);
      });
    // }else{
    //   this.errorMsg = '手机号格式不正确，请重新输入'
    // }
  }

  // 首次登陆，非微信进入绑定手机和修改默认密码
  sureBindPhone() {
    // let checkBoole = this.checkPhoneFn(this.bindData.mobilePhone);
    // if(checkBoole){
    this.bindData.userId = this.userId;
    this.bindData.verificationCode = this.bindDataHasPassword.verificationCode;
    this.bindData.mobilePhone = this.bindDataHasPassword.mobile;
    this.bindData.password = this.bindDataHasPassword.password;
    this.bindPhoneService.sureBindPhone(this.bindData).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          if (+this.userId === 0 && this.bindData.openId) { // 微信扫码登录
            this.weChatLoginFn();
          } else {
            this.router.navigateByUrl('page');
          }
        } else {
          this.errorMsg = resData.msg;
        }
      },
      err => {
        console.log(err);
      });
    // }else{
    //   this.errorMsg = '手机号格式不正确，请重新输入'
    // }
  }

  weChatPostdata: any = {
    openId: '',
    accessToken: '',
    clientSecret: 'MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ'
  };

  // 微信登录
  weChatLoginFn() {
    this.weChatPostdata.openId = this.commonService.getCookie('openId');
    this.weChatPostdata.accessToken = this.commonService.getCookie('wechatAccessToken');
    return this.bindPhoneService.weChatLoginFn(this.weChatPostdata).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this.commonService.loginSetData(resData.data);
        }
      },
      err => {
        console.log(err);
      });
  }

  // 获取用户数据
  getUserData(userId: any) {
    if (+userId === 0) {
      return false;
    }
    this.bindPhoneService.getUserData(userId).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this.loginUserData = resData.data;
          this.bindDataHasPassword.mobile = resData.data.mobilePhone;
          this.oldPhoneNum = resData.data.mobilePhone;
        } else {
          this.errorMsg = resData.msg;
        }
      },
      err => {
        console.log(err);
      });
  }

  checkPhoneFn(phone: any) {
    setTimeout(() => {
      const myReg = /^1(3|4|5|7|8)+\d{9}$/;
      const phoneBoole = +phone === +this.oldPhoneNum;
      if (myReg.test(phone) && !phoneBoole) {
        this.authService.validationPhone(phone).subscribe((data: any) => {
          if (+data.code === 200) {
            this.checkPhoneMsg.isCan = true;
            this.checkPhoneMsg.msg = '';
            this.isDisabledBind = false;
          } else {
            this.checkPhoneMsg.isCan = false;
            this.isDisabledBind = false;
            if (+this.userId === 0) {
              this.checkPhoneMsg.msg = ''; // 不做手机号已被注册提示
            } else {
              this.checkPhoneMsg.msg = '该手机号已存在';
            }
          }
        });
      } else if (phoneBoole) {
        this.checkPhoneMsg.msg = ''; // 不做手机号已被注册提示
        this.isDisabledBind = false;
        this.checkPhoneMsg.isCan = true;
      } else {
        this.checkPhoneMsg.msg = '输入的手机格式不正确';
        this.isDisabledBind = true;
      }
    });
  }

  /*
    获取验证码 倒计时定时器
  */
  /*private timer;
  private paracont: string = '获取验证码';
  private disabledClick: boolean = false;

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
        if (+second === 0) {
          this.paracont = '重发验证码';
          this.disabledClick = false;
        }
      }
    }, 1000, 60);
  }

  ngAfterViewInit() {

  }

  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.sub.unsubscribe();
  }*/

}
