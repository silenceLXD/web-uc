import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class TimerButtonService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 发送验证码
  sendPhoneCodeFn(data: any): any {
    return this.http.post('/uc/common/verificationCode', data);
  }

  // 获取账号绑定验证码接口
  sendBindPhoneCodeFn(data: any): any {
    return this.http.post('/uc/user/binding/mobile/verificationCode', data);
  }


}
