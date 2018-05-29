import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class SetupThreeService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 下一步
  toNextStep(data: any): any {
    return this.http.post('/uc/user/password', data);
  }


}
