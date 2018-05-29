import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RechargeService {

  constructor(private http: HttpClient) {
  }

  // 充值金额切换
  goAliPayFn(rechargeMoney: any, data: any): any {
    return this.http.get('/uc/alipay/goPay/' + rechargeMoney, data);
  }

}
