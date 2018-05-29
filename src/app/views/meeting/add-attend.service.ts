import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class AddAttendService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 参会者公司人员数据
  loadUserData(data: any) {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/user/tree/group/3' + getData);
  }

  // 参会者会议室数据
  loadRoomData(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/userRoom/room-user/' + entId + '/find' + getData);
  }

}
