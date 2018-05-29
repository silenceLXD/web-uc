import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class CheckEmailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  checkIdentity(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/person/success/html' + getData);
  }

  // 重新发送邮件验证
  reCheckEmail(email: any): any {
    return this.http.get('/uc/user/insert/send/email?email=' + email);
  }

}
