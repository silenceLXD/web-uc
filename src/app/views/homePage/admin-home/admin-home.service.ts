import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class AdminHomeService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  getIndexDataFn(): any {
    return this.http.get('/uc/order/index');
  }

}
