import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class MeetingRequestService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 允许/拒绝直播申请入会
  handleApplyFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/handle-apply', data);
  }

}
