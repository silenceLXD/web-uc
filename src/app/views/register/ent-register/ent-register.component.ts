import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {FormValidators} from '@services/form-validators';
import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import {emailValidator, mobilePhoneValidator} from '../../../validators/validators';
import {EntRegisterService} from "./ent-register.service";

@Component({
  selector: 'ent-register',
  templateUrl: './ent-register.component.html',
  styleUrls: ['../register.component.css']
})
export class EntRegisterComponent implements OnInit {
  entRegisterForm: FormGroup;
  inputMobile: any;
  inputEntName: any;
  inputEmail: any;
  // public val:FormValidators;//定义一个validators类型的变量 val

  isagreed = true;

  /*重复验证*/
  isDesabledButton: boolean; // 判断重复禁用保存
  /*企业名称*/
  entNameRepeat = false; // 判断企业名是否重复
  /*邮件*/
  emailRepeat = false; // 判断邮件是否重复
  /*手机号*/
  mobilePhoneRepeat = false; // 判断手机号是否重复

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private entRegisterService: EntRegisterService,
              private authService: AuthService) {
    // this.val = new FormValidators();
    this.entRegisterForm = fb.group({
      entName: ['', [Validators.required]], // 企业名称
      email: ['', [Validators.required, emailValidator]], // 邮箱
      password: ['', [Validators.required, Validators.minLength(6)]],  // 密码
      mobile: ['', [Validators.required, mobilePhoneValidator]],  // 手机号
      verificationCode: ['', [Validators.required]],  // 验证码
      agreed: true
    });
  }

  ngOnInit() {
    // 验证企业名称表单选项唯一
    this.entRegisterForm.get('entName').valueChanges
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
    this.entRegisterForm.get('email').valueChanges
      .do(() => this.emailRepeat = false)
      .debounceTime(500)
      .subscribe(
        value => {
          if (value !== '' && !this.entRegisterForm.hasError('email', ['email'])) {
            this.getEmailRepeat(value);
          }
        }
      );
    // 验证手机表单选项唯一
    this.entRegisterForm.get('mobile').valueChanges
      .do(() => this.mobilePhoneRepeat = false)
      .debounceTime(500)
      .subscribe(
        value => {
          if (value !== '' && !this.entRegisterForm.hasError('mobilePhone', ['mobile'])) {
            this.getMobilePhoneRepeat(value);
          }
        }
      );
  }

  /**************验证器***************/

  // 企业名称或邮箱或手机号重复时对保存的禁用
  setDesabledButton() {
    this.isDesabledButton = this.entNameRepeat || this.emailRepeat || this.mobilePhoneRepeat;
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

  // 验证手机号是否存在
  checkPhoneMsg: any = {
    isCan: false,
    msg: ''
  };

  checkPhoneFn(phone: any) {
    /* const myReg = /^1(3|4|5|7|8)+\d{9}$/;
     if (myReg.test(phone)) {
       this.authService.validationPhone(phone).subscribe((data: any) => {
         if (+data.code === 200) {
           this.checkPhoneMsg.isCan = true;
         } else {
           this.checkPhoneMsg.isCan = false;
           this.checkPhoneMsg.msg = data.msg;
         }
       });
     }*/
  }

  // 验证企业名称是否存在
  checkEntNameMsg: any = {
    isCan: false,
    msg: ''
  };

  checkEntNameFn(name: any) {
    /*this.authService.validationEntName(name).subscribe((data: any) => {
      if (+data.code === 200) {
        this.checkEntNameMsg.isCan = true;
      } else {
        this.checkEntNameMsg.isCan = false;
        this.checkEntNameMsg.msg = data.msg;
      }
    });*/
  }

  // 验证邮箱是否存在
  checkEmailMsg: any = {
    isCan: false,
    msg: ''
  };

  checkEmailFn(email: any) {
    /*const emailReg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (emailReg.test(email)) {
      this.authService.validationEmail(email).subscribe((data: any) => {
        if (+data.code === 200) {
          this.checkEmailMsg.isCan = true;
        } else {
          this.checkEmailMsg.isCan = false;
          this.checkEmailMsg.msg = data.msg;
        }
      });
    } else {
      this.checkEmailMsg.isCan = false;
      this.checkEmailMsg.msg = '输入的邮箱格式不正确';
    }*/

  }

  errorMsg = ''; // 错误消息提示
  // 提交企业注册
  postFormData(val: any) {
    const postData = val;
    this.entRegisterService.postFormData(postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.router.navigate(['/email', 2, val.email]);
        } else {
          this.errorMsg = resultData.msg;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
