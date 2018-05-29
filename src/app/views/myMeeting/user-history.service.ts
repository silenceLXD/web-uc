import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserHistoryService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/conferences/history' + getData);
  }

}
