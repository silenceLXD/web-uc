import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
// import {HttpInterceptorService} from '@services/HttpUtils.Service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Observable} from 'rxjs/observable';
import {Router} from '@angular/router';
import {CommonService} from '@services/common.service';
import * as EventSource from 'eventsource';
import {NzNotificationService} from 'ng-zorro-antd';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  msgBindWeChatError: any;
  private loginForm: FormGroup;
  private localName: string;
  private localPassword: string;
  private timestamp: number; // 生成图片验证码时的时间戳
  public captchaUrl = environment.apiBase + '/uc/captcha'; // 验证码图片初始化
  public codeUrl: string; // 二维码url
  public errorMsg: any; // 返回的登录信息提示
  public loginway = 'psd'; // 初始化登录方式为密码登录
  public expiredShow: any = false;
  public isAvoid = true;
  public loginSuccess = false; // 登录成功禁掉提交
  prevReferrer: string; // 前一页url
  regToLoginData: any; // 注册之后立即登录的数据
  errCount: any = 0; //账号密码输入错误次数
  errLoginCount: any = 0;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private commonService: CommonService,
              private loginService: LoginService,
              private _notification: NzNotificationService) {
    this.loginForm = fb.group({
      username: [this.localName],
      password: [this.localPassword],
      randomStr: '',
      captcha: '', // 验证码
      clientSecret: 'MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ',
      // isAvoid:[true]
      isKeepLogin: this.isAvoid
    });
  }

  ngOnInit() {
    this.changeCodeImg();
    this.msgBindWeChatError = this.decodeUTF8(this.commonService.getCookie('bindWeChatError'));
    if (this.msgBindWeChatError) {
      this._notification.create('error', this.msgBindWeChatError, '');
      this.commonService.deleCookie('bindWeChatError');
    }
    if (this.commonService.checkCookie('uc_errCount')) {
      this.errCount = this.errLoginCount = this.commonService.getCookie('uc_errCount');
    }

    this.prevReferrer = document.referrer;

    // 注册后立即登录
    this.regToLoginData = {
      username: this.commonService.getCookie('username'),
      password: this.commonService.getCookie('password'),
      captcha: this.commonService.getCookie('captcha'),
      randomStr: this.commonService.getCookie('randomStr'),
    };
    if (this.regToLoginData.randomStr) {
      // console.log(this.loginForm.value);
      this.postFormData(this.loginForm.value);
    }

    this.loginForm.valueChanges
      .debounceTime(50)
      .subscribe(data => {
        this.errorMsg = '';
      });
  }

  // 解码utf8
  decodeUTF8(str) {
    return str.replace(/(\\u)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
      return String.fromCharCode(parseInt($2, 16));
    });
  }

  // 点击更换验证码
  oImgSrc: string;

  changeCodeImg() {
    this.timestamp = (new Date()).valueOf();
    this.oImgSrc = this.captchaUrl + '/' + this.timestamp;
    setTimeout('this.errorMsg = \'\'', 3000);
  }

  /**************** 手机号／邮箱 登录 *****************/

  postFormData(val: any) {
    if (this.loginSuccess) {
      return false;
    } else {
      this.loginSuccess = true;
    }
    val.randomStr = '' + this.timestamp;
    if (this.regToLoginData.randomStr) {
      val.username = this.regToLoginData.username;
      val.password = this.regToLoginData.password;
      val.captcha = this.regToLoginData.captcha;
      val.randomStr = this.regToLoginData.randomStr;
    }
    const loginData = val;
    // let loginUrl = "/uc/login?username="+val.email+"&password="+val.password+"&grant_type=password&scope=web&client_id=2513608755203&client_secret=32b42c8d694d520d3e321"
    return this.loginService.postFormData(loginData).subscribe(
      res => {
        const resObj: any = res;
        this.commonService.deleCookie('uc_errCount');
        if (+resObj.code === 200) {
          const resData = resObj.data;
          this.commonService.loginSetData(resData); // 设置本地存储信息
          this.loginSuccess = false;
        } else {
          this.errorMsg = resObj.msg;
          this.changeCodeImg();
          this.loginSuccess = false;
        }
      },
      err => {
        this.changeCodeImg();
        if (+err.error.code === 4021) {
          this.errorMsg = '账号已被冻结！如有疑问，请拨打电话：010-5873 4583';
          console.log('账号已被冻结！如有疑问，请拨打电话：010-5873 4583');
        } else if (+err.error.code === 6002) {
          // this.errorMsg = err.error.msg;
          this.router.navigate(['/email', 2, err.error.data]);
        } else if (+err.error.code === 4013) { //账号或密码有误
          this.errLoginCount++;
          this.commonService.setCookie('uc_errCount', this.errLoginCount, 3600);
          this.errorMsg = err.error.msg;
        } else {
          setTimeout(() => {
            this.errorMsg = err.error.msg;
          }, 500);
          // console.log(err);
        }
        this.loginSuccess = false;
      });
  }

  /******** 云起云App扫码登录 ********/
  private timer: any;
  codeExpire: any;
  qrcodeOverdue = false;
  qrcodeSuccess = false;

  loginByCode() {
    this.loginway = 'qrcode';
    this.qrcodeSuccess = false;
    this.expiredShow = false;
    this.getCodeInfo().add(() => {
      this.timer = setTimeout(() => {
        this.expiredShow = true;
        this.qrcodeOverdue = false;
      }, 180 * 1000);
    });
  }

  // 获取登录的二维码信息
  getCodeInfo() {
    return this.loginService.getCodeInfo().subscribe(
      res => {
        const resData: any = res;
        this.codeUrl = resData.data.qrCodeUrl;
        this.codeExpire = resData.data.qrCodeExpire;
        this.connectSSE(resData.data.uuid);
      },
      err => {
        console.log(err);
      });
  }

  // 扫码成功
  getCodeConnectSSE() {
    clearTimeout(this.timer);
    this.qrcodeSuccess = true;
  }

  // 二维码失效
  getCodeQrcodeOverdue() {
    this.expiredShow = true;
    this.qrcodeSuccess = false;
    this.qrcodeOverdue = false;
  }

  // 登录失败
  getCodeQrcodeFailure() {
    this.expiredShow = true;
    this.qrcodeSuccess = false;
    this.qrcodeOverdue = true;
  }

  /******** 微信登录 ********/
    // 微信登录获取配置
  showlogincode = false;
  weixin_href: any;

  weixinLogin() {
    this.showlogincode = true;
    this.loginService.weixinLogin().subscribe(
      res => {
        const resData: any = res;
        const wxLoginData: any = {
          id: 'login_container',
          appid: resData.data.appId,
          scope: resData.data.scope,
          redirect_uri: encodeURIComponent(resData.data.redirectUri),
          state: resData.data.state,
          style: 'white',
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

  // 连接SSE
  source: any;

  connectSSE(uuid: any) {
    // uuid: 获取登录的二维码信息的返回参数
    this.source = new EventSource(environment.apiBase + '/uc/sse/qrCodeLogin/connect/' + uuid);
    // 监听sse消息
    this.source.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      this.appendSSEData(data);
    }, false);
    setTimeout(() => { // 3分钟后关闭sse连接
      this.source.close();
    }, 180 * 1000);
  }

  /* 处理返回的sse消息
  * type = 0 登录
  * type = 1 扫码
  * type = 2 取消登录
  * type = 3 二维码过期
  */
  appendSSEData(data: any) {
    switch (+data.notifyType) {
      case 0:
        const postData = {
          username: data.username,
          clientSecret: 'MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ'
        };
        if (data.username) {
          this.http.post('/uc/qrCodeLogin', postData).subscribe(
            res => {
              const resData: any = res;
              this.commonService.loginSetData(resData.data); // 设置本地存储信息
            },
            err => {
              console.log(err);
            });
        }
        break;
      case 1:
        this.getCodeConnectSSE();
        break;
      case 2:
        this.getCodeQrcodeFailure();
        break;
      case 3:
        this.getCodeQrcodeOverdue();
        break;
    }
  }

  //销毁组件时清除定时器
  ngOnDestroy() {
    if (this.source) {
      this.source.close();//关闭 SSE 连接
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
