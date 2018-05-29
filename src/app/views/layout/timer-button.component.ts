import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {TimerButtonService} from "./timer-button.service";

@Component({
  selector: 'timer-button',
  template: `
    <button type="button" class="code-btn" [disabled]="disabledClick" (click)="getPhoneCodeFn()">{{paracont}}</button>
  `,
  styles: [`
    button.code-btn {
      background: transparent;
      border: none;
    }
  `]
})
export class TimerButtonComponent implements OnInit, OnDestroy {
  @Input() phoneNum: string;
  @Input() sendType: string;
  codeData: any;

  constructor(private http: HttpClient,
              private timerButtonService: TimerButtonService,
              private _notification: NzNotificationService) {
  }

  ngOnInit() {
  }

  // 获取手机验证码接口
  getPhoneCodeFn() {
    if (+this.sendType === 1) {
      this.sendBindPhoneCodeFn();
    } else {
      this.sendPhoneCodeFn();
    }
  }

  // 获取其他手机验证码接口
  sendPhoneCodeFn() {
    // console.log(phone)
    const postData = {
      mobile: this.phoneNum,
      type: this.sendType // 1：账号绑定 2：找回密码 3：个人注册、企业注册  4：验证手机号
    };
    if (this.phoneNum) {
      // 发送验证码
      this.timerButtonService.sendPhoneCodeFn(postData).subscribe(
        res => {
          const resultData: any = res;
          if (+resultData.code === 200) {
            this.sendMessage(); // 倒计时
          }
        },
        err => {
          console.log(err);
        });
    } else {
      console.log('请输入手机号');
      this._notification.create('error', '请输入手机号', '');
    }
  }

  // 获取账号绑定验证码接口
  sendBindPhoneCodeFn() {
    this.timerButtonService.sendBindPhoneCodeFn({mobile: this.phoneNum}).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.codeData = resultData.data;
          this.sendMessage(); // 倒计时
        }
      },
      err => {
        console.log(err);
      });
  }

  /*
    获取验证码 倒计时定时器
  */
  private timer: any;
  paracont: string = '获取验证码';
  disabledClick = false;

  sendMessage() {
    let second = 60;
    this.timer = setInterval(() => {
      this.disabledClick = true;
      if (second <= 0) {
        this.disabledClick = false;
        clearInterval(this.timer);
        second = 60;
      } else {
        second--;
        this.paracont = second + '秒后可重发';
        if (+second === 0) {
          this.disabledClick = false;
          this.paracont = '获取验证码';

        }
      }
    }, 1000, 60);
  }

  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
