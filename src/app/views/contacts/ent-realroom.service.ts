import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntRealroomService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询组织列表
  getOrganizationList(entId: any): any {
    return this.http.get('/uc/user/ents/' + entId + '/orgs');
  }

  // 查找会议室列表
  getRealroom(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/userRoom/room-user/' + entId + '/find' + getData);
  }

  // 保存添加会议室
  saveBtn_ok(data: any): any {
    return this.http.post('/uc/userRoom/room-user', data);
  }

  // 确定删除会议室
  deleteBtn_ok(roomId: any): any {
    return this.http.delete('/uc/userRoom/room-user/' + roomId);
  }

  // 编辑会议室
  sureEditRoomFn(roomId: any, data: any): any {
    return this.http.post('/uc/userRoom/room-user/' + roomId, data);
  }

}
