import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MeetingControlBtnService {

  constructor(private http: HttpClient) {
  }

  // 根据cid判断会议是否已结束 返回值为true/false
  checkMeetingFn(cid: any): any {
    return this.http.get('/uc/conferences/' + cid + '/is-end');
  }

}
