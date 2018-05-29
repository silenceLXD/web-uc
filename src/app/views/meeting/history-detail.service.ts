import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class HistoryDetailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  operationDetailFn(appointType: any, cid: any) {
    let geturl;
    if (+appointType === 1) {
      geturl = '/uc/conferences/' + cid + '/history';
    } else if (+appointType === 2) {
      geturl = '/uc/appointments/' + cid + '/history';
    }
    return this.http.get(geturl);
  }
  // 获取会议日志 每次请求20条日志数据
  checkLogFn(cid: any, pageNum:any) {
    return this.http.get('/uc/conferences/' + cid + '/log/' + pageNum + '/20');
  }

  // 下载会议日志
  downloadLogFn(cid: any, userId: any) {
    return '/uc/conferences/' + cid + '/down-log/' + userId;
  }

}
