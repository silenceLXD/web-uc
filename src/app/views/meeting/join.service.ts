import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class JoinService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 加入会议
  joinVmrFn(number: any) {
    return this.http.post('/uc/conferences/' + number + '/check', '');
  }

  // 检查会议号
  checkVmrFn(number: any) {
    return this.http.post(`/uc/conferences/${number}/check-type`, '');
  }

}
