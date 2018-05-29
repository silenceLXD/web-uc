import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class MeetingVoteService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 提交新增投票
  submitAddVoteForm(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/vote', data);
  }

  // 查看会议进行中的投票
  getVoteData(cid: any) {
    return this.http.get('/uc/conferences/' + cid + '/vote');
  }

  // 确定取消投票
  sureCancelVoteFn(cid: any, voteId: any) {
    return this.http.post('/uc/conferences/' + cid + '/vote/' + voteId + '/cancel', '');
  }

  // 确定结束投票
  sureStopVoteFn(cid: any, voteId: any) {
    return this.http.post('/uc/conferences/' + cid + '/vote/' + voteId + '/stop', '');
  }

  // 获取历史投票记录
  historyVoteFn(cid: any) {
    return this.http.get('/uc/conferences/' + cid + '/vote/history');
  }

}
