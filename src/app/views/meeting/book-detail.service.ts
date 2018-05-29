import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class BookDetailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  operationDetailFn(appointmentId: any) {
    return this.http.get('/uc/appointments/' + appointmentId);
  }

}
