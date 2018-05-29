import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class ConsumptionDetailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取数据 月租费用详单：3 ，会议详单：4，直播详单：5，点播详单 ：6
  getMeetingList(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/' + entId + '/entbills/detail' + getData);
  }

  // 查看详情
  getDetailDataFn(list: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/users/' + list.cid + '/participants' + getData);
  }

  // 下载
  downEntExcel(entId: any, userId: any, monthSt: any): any {
    return `/uc/ents/exportUserBill?entId=${entId}&userId=${userId}&searchmonth=${monthSt}`;
  }

}
