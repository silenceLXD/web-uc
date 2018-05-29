import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/message' + getData);
  }

  // 获取消息总数和已读数
  getMsgCount(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/message/count' + getData);
  }

  // 标记消息为已读 方法
  markToReaded(data: any): any {
    return this.http.post('/uc/message/sign', data);
  }

  // 删除消息 方法
  deleteMsg(data: any): any {
    return this.http.post('/uc/message/delete', data);
  }

  // 点击查看详情
  showDetailMsg(id: any): any {
    return this.http.get('/uc/message/' + id);
  }

}
