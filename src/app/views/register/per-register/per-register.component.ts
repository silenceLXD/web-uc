import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {CommonService} from '@services/common.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import {mobilePhoneValidator, nameValidator} from '../../../validators/validators';
import {PerRegisterService} from "./per-register.service";

@Component({
  selector: 'per-register',
  templateUrl: './per-register.component.html',
  styleUrls: ['../register.component.css']
})
export class PerRegisterComponent implements OnInit {
  public perRegisterForm: FormGroup;
  isagreed = true;
  inputMobile: any;
  errorMsg = '';
  checkPhoneMsg: any = {
    isCan: false,
    msg: ''
  };

  /*重复验证*/
  isDesabledButton: boolean; // 判断重复禁用保存
  /*手机号*/
  mobilePhoneRepeat = false; // 判断手机号是否重复

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private commonService: CommonService,
              private perRegisterService: PerRegisterService,
              private authService: AuthService) {
    this.perRegisterForm = this.fb.group({
      realName: ['', [Validators.required, nameValidator]], // 用户名称
      password: ['', [Validators.required, Validators.minLength(6)]],  // 密码
      mobile: ['', [Validators.required, mobilePhoneValidator]],  // 手机号
      verificationCode: '',  // 手机号验证码
      agreed: true
    });
  }

  ngOnInit() {

    // 验证手机表单选项唯一
    this.perRegisterForm.get('mobile').valueChanges
      .do(() => this.mobilePhoneRepeat = false)
      .debounceTime(500)
      .subscribe(
        value => {
          if (value !== '' && !this.perRegisterForm.hasError('mobilePhone', ['mobile'])) {
            this.getMobilePhoneRepeat(value);
          }
        }
      );

  }

  // 提交个人注册
  postFormData(val: any) {
    const postData = val;
    this.perRegisterService.postFormData(postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.router.navigate(['/email', 1, val.mobile]);
          const exp = new Date();
          exp.setTime(exp.getTime() + 15 * 1000);
          document.cookie = 'username=' + postData.mobile + '; path=/;expires=' + exp.toUTCString();
          document.cookie = 'password=' + postData.password + '; path=/;expires=' + exp.toUTCString();
          document.cookie = 'captcha=' + resultData.data.captcha + '; path=/;expires=' + exp.toUTCString();
          document.cookie = 'randomStr=' + resultData.data.nanoTime + '; path=/;expires=' + exp.toUTCString();
        } else {
          this.errorMsg = resultData.msg;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // 企业名称或邮箱或手机号重复时对保存的禁用
  setDesabledButton() {
    this.isDesabledButton = this.mobilePhoneRepeat;
  }

  // 手机重复验证
  getMobilePhoneRepeat(value) {
    this.authService.validationPhone(value).subscribe((data: any) => {
        if (+data.code === 200) {
          this.mobilePhoneRepeat = false;
          this.setDesabledButton();
        } else {
          this.mobilePhoneRepeat = true;
          this.setDesabledButton();
        }
      },
      err => {
        console.log(err);
      });
  }

}
