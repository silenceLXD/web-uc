import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntRegisterService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 提交企业注册
  postFormData(data: any): any {
    return this.http.post('/uc/ents/register', data);
  }


}
