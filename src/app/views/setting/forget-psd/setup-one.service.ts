import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class SetupOneService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 下一步(向父组件传递数据)
  toNextStep(data: any): any {
    return this.http.post('/uc/user/forget/pwd/verify/account', data);
  }

}
