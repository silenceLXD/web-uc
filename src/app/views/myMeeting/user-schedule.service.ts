import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserScheduleService {

  constructor(private http: HttpClient, private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/appointments' + getData);
  }

  // 获取重复会议
  judgeIsRepeat(appointmentId: any): any {
    return this.http.get('/uc/appointments/' + appointmentId + '/repeat');
  }
  // 确定删除已选择会议
  sureDeleteMeetingFn(data: any): any {
    return this.http.delete('/uc/appointments/delete?appointmentIds=' + data);
  }

}
