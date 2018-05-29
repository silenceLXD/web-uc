import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {ProductListService} from '../product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productType = 2;  // 默认显示 productType = 包时2；计时3；附加包4
  productListData: any;

  constructor(private http: HttpClient,
              private productListService: ProductListService,
              private commonService: CommonService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
  }

  ngOnInit() {
    this.getProductDataFn(this.productType);
  }

  getProductDataFn(productType: any) {
    return this.productListService.getProductDataFn(productType).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.productListData = resultData.data;
        }
      },
      err => {
        console.log('查询商品列表err....');
      });
  }

  changeProdTypeFn(type: any) {
    this.productType = type;
    this.getProductDataFn(type);
  }
}
