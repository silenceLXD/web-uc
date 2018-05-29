import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class HistoryScheduleService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(entId: any, data: any) {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/' + entId + '/appointments/history' + getData);
  }

}
