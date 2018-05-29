import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class OrderListService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 表格列表数据初始化
  getTableDataFn(data: any, pageNum: any, pageSize: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/order/' + pageNum + '/' + pageSize + getData);
  }

  // 删除订单
  deleOrder(orderNo: any): any {
    return this.http.post('/uc/order/' + orderNo, '');
  }

  // 取消订单
  cancelOrder(orderNo: any): any {
    return this.http.post('/uc/order/' + orderNo + '/cancel', '');
  }

  // 续费 按钮  判断是否存在续费订单
  renewalsFn(orderNo: any): any {
    return this.http.get('/uc/order/' + orderNo + '/exist/delay');
  }

  // 再次购买 按钮  跳转到商品详情页面
  buyAgainFn(entId: any, pid: any): any {
    return this.http.get('/uc/order/' + entId + '/buy/' + pid + '/again');
  }
}
