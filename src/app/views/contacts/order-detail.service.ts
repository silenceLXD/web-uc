import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class OrderDetailService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 根据订单号orderNo查询订单详情
  getOrderDetailFn(orderNo: any): any {
    return this.http.get('/uc/order/' + orderNo + '/detail');
  }

  // 续费 按钮  判断是否存在续费订单
  renewalsFn(orderNo: any): any {
    return this.http.get('/uc/order/' + orderNo + '/exist/delay');
  }

  // 再次购买 按钮  跳转到商品详情页面
  buyAgainFn(entId: any, pid: any): any {
    return this.http.get('/uc/order/' + entId + '/buy/' + pid + '/again');
  }

  // 取消订单
  cancelOrder(orderNo: any): any {
    return this.http.post('/uc/order/' + orderNo + '/cancel', '');
  }

}
