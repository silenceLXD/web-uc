import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserVideoService {

  constructor(private http: HttpClient, private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/records' + getData);
  }

  // 查询企业公共录播文件列表
  getEntTableData(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/records/public' + getData);
  }
  // 删除视频方法
  deleVideo(data: any): any {
    return this.http.delete('/uc/records/delete?ids=' + data);
  }

}
