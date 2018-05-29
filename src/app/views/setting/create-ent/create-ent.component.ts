import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {AuthService} from '@services/auth.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {emailValidator} from '../../../validators/validators';
import {CreateEntService} from './create-ent.service';

@Component({
  selector: 'app-create-ent',
  templateUrl: './create-ent.component.html',
  styleUrls: ['./create-ent.component.css']
})
export class CreateEntComponent implements OnInit {

  emailMsg = false;  // 判断邮箱是否已被注册  true为  已注册
  entNameMsg = false; // 判断企业名称是否已被注册 true为  已注册
  validaeEmail = false; // 点击下一步  true为已通过
  entName: any = '';  // 企业名称
  email: any = ''; // 邮箱名称

  /*重复验证*/
  isDesabledButton: boolean; // 判断重复禁用保存
  /*企业名称*/
  entNameRepeat = false; // 判断企业名是否重复
  /*邮件*/
  emailRepeat = false; // 判断邮件是否重复

  public loginUserData = this.commonService.getLoginMsg();
  entId: any = this.loginUserData.entId;
  userId: any = this.loginUserData.userId;

  addEntForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private createEntService: CreateEntService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.addEntForm = this.fb.group({
      orgName: ['', [Validators.required]],
      email: ['', [Validators.required, emailValidator]]
    });

    // 验证企业名称表单选项唯一
    this.addEntForm.get('orgName').valueChanges
      .do(() => this.entNameRepeat = false)
      .debounceTime(500)
      .subscribe(
        value => {
          if (value !== '') {
            this.getEntNameRepeat(value);
          }
        }
      );
    // 验证邮件表单选项唯一
    this.addEntForm.get('email').valueChanges
      .do(() => this.emailRepeat = false)
      .debounceTime(500)
      .subscribe(
        value => {
          if (value !== '' && !this.addEntForm.hasError('email', ['email'])) {
            this.getEmailRepeat(value);
          }
        }
      );
  }

  /**************验证器***************/

  // 企业名称或邮箱或手机号重复时对保存的禁用
  setDesabledButton() {
    this.isDesabledButton = this.entNameRepeat || this.emailRepeat;
  }

  // 企业名重复验证
  getEntNameRepeat(value) {
    this.authService.validationEntName(value).subscribe((data: any) => {
      if (+data.code === 200) {
        this.entNameRepeat = false;
        this.setDesabledButton();
      } else {
        this.entNameRepeat = true;
        this.setDesabledButton();
      }
    }, err => {
      console.log(err);
    });
  }

  // 邮箱重复验证
  getEmailRepeat(value) {
    this.authService.validationEmail(value).subscribe((data: any) => {
        if (+data.code === 200) {
          this.emailRepeat = false;
          this.setDesabledButton();
        } else {
          this.emailRepeat = true;
          this.setDesabledButton();
        }
      },
      err => {
        console.log(err);
      });
  }

  /* 验证企业名称是否重复 */
  checkEntName() {
    /*this.http.get('/uc/ents/validation/name?entName=' + this.entName).subscribe(
      res => {
        console.log(res);
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.entNameMsg = false;
        } else {
          if (this.entName !== '') {
            this.entNameMsg = true;
          }
        }
      },
      err => {
        console.log(err);
      }
    );*/
  }

  /* 验证邮箱是否存在 */
  checkEmail() {
    /*this.http.get('/uc/user/validation/email?email=' + this.email).subscribe(
      res => {
        console.log(res);
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.emailMsg = false;
        } else {
          if (this.email !== '') {
            this.emailMsg = true;
          }
        }
      },
      err => {
        console.log(err);
      }
    );*/
  }

  /* 下一步 */
  nextStep() {
    if (this.addEntForm.valid) {
      this.createEntService.nextStep(this.addEntForm.value).subscribe(
        res => {
          console.log(res);
          const datalist: any = res;
          if (+datalist.code === 200) {
            this.router.navigate(['/email', 2, this.email]);
          } else {
            this._notification.create('error', '创建失败', '');
          }
        },
        err => {
          console.log(err);
        }
      );
    }

  }

  /* 立即登录邮箱验证 */
  // loginEmail() {
  //   let isEmail = this.email.split('@')[1];
  //   switch (isEmail) {
  //     case 'qq.com':
  //       window.location.href = 'https://mail.qq.com/';
  //       break;
  //     case '163.com':
  //       window.location.href = 'https://mail.163.com/';
  //       break;
  //     case '126.com':
  //       window.location.href = 'https://mail.126.com/';
  //       break;
  //     case 'gmail.com':
  //       window.location.href = 'https://mail.google.com/mail';
  //       break;
  //     case 'Hotmail.com':
  //       window.location.href = 'https://outlook.live.com/owa/';
  //       break;
  //     case 'aliyun.com':
  //       window.location.href = 'https://qiye.aliyun.com/';
  //       break;
  //   }
  //
  //   setTimeout(() => {
  //    this.router.navigate(['/login']);
  //    localStorage.clear();
  //  }, 1000);
  // }

  loginEmail() {
    let email = this.email;
    /* 截取@后面.前面的所有数据 */
    const index = email.lastIndexOf('@');
    email = email.substring(index + 1, email.length);
    const dotIndex = email.indexOf('.');
    email = email.substring(0, dotIndex);
    // 跳转到对应邮箱网站
    window.open('http://mail.' + email + '.com/', '_blank');

    setTimeout(() => {
      this.router.navigate(['/login']);
      localStorage.clear();
    }, 1500);

  }

}
