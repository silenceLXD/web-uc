import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PersonalDetailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取数据 会议详单
  getMeetingList(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/users/' + entId + '/participant/detail' + getData);
  }

  // 查看详情
  entLookBtn(list: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/' + list.userId + '/userbills/detail' + getData);
  }

  // 一级部门选择
  getOneOrganization(entId: any): any {
    return this.http.get('/uc/organization/select/' + entId);
  }

  // 下载消费明细
  downEntExcel(entId: any, userId: any, monthSt: any): any {
    return `/uc/ents/exportUserBill?entId=${entId}&userId=${userId}&searchmonth=${monthSt}`;
  }

}
