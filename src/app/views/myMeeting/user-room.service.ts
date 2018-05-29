import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserRoomService {

  constructor(private http: HttpClient) {
  }

  // 表格列表数据初始化
  getTableDataFn(userId: any): any {
    return this.http.get('/uc/' + userId + '/rooms');
  }

  // 确定编辑 修改专属会议室
  submitUpdateFn(vmrNumber: any, data: any): any {
    return this.http.post('/uc/rooms/' + vmrNumber, data);
  }

}
