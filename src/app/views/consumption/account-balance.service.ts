import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class AccountBalanceService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(pageNum: any, pageSize: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/account/detail/' + pageNum + '/' + pageSize + getData);
  }

  // 根据企业id获取企业可用余额  账号id
  getAccountMoney(entId: any): any {
    return this.http.get('/uc/account/' + entId + '/avaible-blance');
  }

}
