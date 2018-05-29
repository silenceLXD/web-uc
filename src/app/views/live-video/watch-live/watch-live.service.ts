import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class WatchLiveService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取直播数据 判断直播状态
  getLiveMeetingFn(appointmentId: any): any {
    return this.http.get('/uc/lives/' + appointmentId + '/live-date');
  }

  // 验证输入的直播密码
  checkLivePwdFn(appointmentId: any, data: any): any {
    return this.http.post('/uc/lives/' + appointmentId + '/veri', data);
  }

  // 获取观看人数
  getPlayNumFn(appointmentId: any): any {
    return this.http.get('/uc/lives/' + appointmentId + '/live-date');
  }


}
