import {FormControl} from '@angular/forms';

/**
 * Created by zipeng on 2017/12/29.
 */

export function mobilePhoneValidator(control: FormControl): any {
  const myreg = /^1[3|4|5|7|8][0-9]{9}$/;
  const valid = myreg.test(control.value);
  return valid ? null : {mobilePhone: true};
}

export function emailValidator(control: FormControl): any {
  const myreg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  const valid = myreg.test(control.value);
  return valid ? null : {email: true};
}

export function nameValidator(control: FormControl): any {
  const myreg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
  const valid = myreg.test(control.value);
  return valid ? null : {name: true};
}



