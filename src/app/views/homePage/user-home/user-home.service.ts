import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserHomeService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 加入会议
  joinVmrFn(number: any): any {
    return this.http.post('/uc/conferences/' + number + '/check', '');
  }

  // 检查会议号
  checkVmrFn(number: any): any {
    return this.http.post(`/uc/conferences/${number}/check-type`, '');
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
