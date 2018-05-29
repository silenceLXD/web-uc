import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntVideoService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/' + entId + '/records' + getData);
  }

  // 获取企业存储空间
  getRecordsCount(entId: any): any {
    return this.http.get('/uc/' + entId + '/recordsCount');
  }

  // 删除视频方法
  deleVideo(data: any): any {
    return this.http.delete('/uc/records/delete?ids=' + data);
  }

  // 修改录播视频对外状态
  updateState(data: any, postData: any): any {
    return this.http.post('/uc/records/' + data.fileId + '/state', postData);
  }

}
