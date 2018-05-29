import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntScheduleService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(entId: any, data: any) {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/' + entId + '/appointments' + getData);
  }

  // 获取重复会议
  judgeIsRepeat(appointmentId: any) {
    return this.http.get('/uc/appointments/' + appointmentId + '/repeat');
  }

  // 删除会议 方法
  sureDeleteMeetingFn(data: any) {
    return this.http.delete('/uc/appointments/delete?appointmentIds=' + data);
  }

  // 结束会议方法
  endMeeting(cid: any) {
    return this.http.post('/uc/conferences/' + cid + '/stop', '');
  }

  // 启动会议 按钮
  beginMeetingFn(appointmentId: any) {
    return this.http.post('/uc/appointments/' + appointmentId + '/start', '');
  }

}
