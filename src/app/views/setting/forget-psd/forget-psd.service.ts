import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class ForgetPsdService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  checkIdentity(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/user/email/valadation/identity' + getData);
  }

}
