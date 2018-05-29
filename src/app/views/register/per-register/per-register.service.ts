import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PerRegisterService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 提交个人注册
  postFormData(data: any): any {
    return this.http.post('/uc/user/register', data);
  }


}
