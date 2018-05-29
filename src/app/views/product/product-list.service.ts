import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProductListService {

  ISPUBLIC = 1; // 默认查询所有公开的商品
  constructor(private http: HttpClient) {
  }

  // 商品列表
  getProductDataFn(productType: any): any {
    return this.http.get('/uc/product/all/' + productType + '/' + this.ISPUBLIC);
  }

}
