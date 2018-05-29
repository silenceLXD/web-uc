import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '@services/common.service';
import {HttpClient} from '@angular/common/http';
import {LoginService} from "../../login/login.service";

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit, OnDestroy {
  private thisType: number;//注册类型
  private thisValue: any;//注册类型
  private sub: any;// 传递参数对象

  userSuccess = false;
  validaEmail = false;
  nowDate: any;
  loginTimes = 10;
  loginTimesFn: any;

  regToLoginData: any; // 注册之后立即登录的数据

  constructor(private _activatedRoute: ActivatedRoute,
              private route: Router,
              private http: HttpClient,
              private loginService: LoginService,
              private commonService: CommonService) {
    this.nowDate = new Date().getFullYear();
  }

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.thisType = params['type'];
      this.thisValue = params['val'];
      if (+this.thisType === 1) {
        this.userSuccess = true;
      } else {
        this.validaEmail = true;
      }
    });

    // 注册后立即登录
    this.regToLoginData = {
      username: this.commonService.getCookie('username'),
      password: this.commonService.getCookie('password'),
      captcha: this.commonService.getCookie('captcha'),
      randomStr: this.commonService.getCookie('randomStr'),
      clientSecret: 'MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ',
      isKeepLogin: true
    };

    this.loginTimesFn = setInterval(() => {
      if (this.loginTimes <= 0) {
        this.regToLoginFn();
        clearInterval(this.loginTimesFn);
      }
      if (this.loginTimes > 0) {
        this.loginTimes--;
      }
    }, 1000);
  }

  // 组件卸载的时候取消订阅
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearInterval(this.loginTimesFn);
  }

  // 立即登录到主页
  regToLoginFn() {
    this.postFormData(this.regToLoginData);
  }

  // 邮箱 下一步操作
  loginEmail() {
    let email = this.thisValue;
    /* 截取@后面.前面的所有数据 */
    let index = email.lastIndexOf('@');
    email = email.substring(index + 1, email.length);
    let dotIndex = email.indexOf('.');
    email = email.substring(0, dotIndex);
    // 跳转到对应邮箱网站
    window.open('http://mail.' + email + '.com/', '_blank');

  }

  // 登录
  postFormData(val: any) {
    // const loginUrl = '/uc/login';
    const loginData = val;
    return this.loginService.postFormData(loginData).subscribe(
      res => {
        const resObj: any = res;
        if (+resObj.code === 200) {
          const resData = resObj.data;
          this.commonService.loginSetData(resData); // 设置本地存储信息
        } else {
          // this.errorMsg = resObj.msg;
        }
      },
      err => {
        console.log(err);
      });
  }

}
