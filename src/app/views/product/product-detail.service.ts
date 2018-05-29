import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProductDetailService {

  constructor(private http: HttpClient) {
  }

  // 商品详情
  getProductDetailFn(pid: any): any {
    return this.http.get('/uc/product/' + pid + '/info');
  }

  // 提交订单
  submitOrderFn(data: any): any {
    return this.http.post('/uc/order', data);
  }

  // 续费订单
  renewalsOrderFn(data: any): any {
    return this.http.post('/uc/order/delay', data);
  }

}
