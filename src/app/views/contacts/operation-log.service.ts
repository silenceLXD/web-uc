import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class OperationLogService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/' + entId + '/logs' + getData);
  }

  // 下載操作日誌
  downExcel(entId: any, userId: any, startTime: any, endTime: any, searchStr: any): any {
    return `/uc/ents/${entId}/downloadLog?userId=${userId}&startTime=${startTime}&endTime=${endTime}&searchStr=${searchStr}`;
  }

}
