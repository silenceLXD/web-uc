import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ScheduleDetailService {

  constructor(private http: HttpClient) {
  }

  // 点击会议名称 查看会议详情  根据appointmentId查询
  operationDetailFn(appointmentId: any): any {
    return this.http.get('/uc/appointments/' + appointmentId);
  }

}
