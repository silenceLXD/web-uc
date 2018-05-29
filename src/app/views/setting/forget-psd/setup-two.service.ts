import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class SetupTwoService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 手机号 下一步操作
  toNextStep(data: any): any {
    return this.http.post('/uc/user/phone/valadation/identity', data);
  }

}
