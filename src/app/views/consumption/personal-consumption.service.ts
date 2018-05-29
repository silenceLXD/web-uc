import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PersonalConsumptionService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取数据 会议详单
  getMeetingList(userId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/' + userId + '/userbills/detail' + getData);
  }

  // 查询个人消费详单的汇总
  getUserbills(userId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + userId + '/userbills/collect?searchmonth=' + monthSt);
  }

}
