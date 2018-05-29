import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConsumptionAllService {

  constructor(private http: HttpClient) {
  }

  // 查询本月企业所消耗费用
  getSelectEntBillByMonth(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/selectEntBillByMonth');
  }

  // 查看本月企业会议直播点播概览
  getSelectEntBillOverview(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/selectEntBillOverview');
  }

  // 查询企业部门开会次数 Top5
  getMeetingCount(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/countTop5');
  }

  // 查询会议总消耗分钟数 Top5
  getMeetingTime(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/timeTop5');
  }

  // 查询本月会议分布
  getMeetingDistributed(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/count/point');
  }

  // 本月消耗
  getConsumeMinutes(entId: any, monthSt: any): any {
    return this.http.get('/uc/ents/' + entId + '/' + monthSt + '/groupbyday');
  }

}
