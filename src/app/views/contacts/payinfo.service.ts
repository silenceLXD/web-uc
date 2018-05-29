import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PayinfoService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  getOrderDetailFn(orderNo: any) {
    return this.http.get('/uc/order/' + orderNo + '/detail');
  }

  // 根据企业id获取企业账户可用余额
  getAccountMoney(entId: any): any {
    return this.http.get('/uc/account/' + entId + '/avaible-blance');
  }

  // 确认余额支付
  surePayFnBalance(orderNo: any, data: any): any {
    return this.http.post('/uc/order/' + orderNo + '/receipt', data);
  }

  // 确认支付宝支付
  surePayFnAipay(orderNo: any, data: any): any {
    return this.http.post('/uc/alipay/goPay/' + orderNo, data);
  }


  // payinfoService
}
