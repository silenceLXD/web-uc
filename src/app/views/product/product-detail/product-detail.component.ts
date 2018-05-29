import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';
import {ProductDetailService} from '../product-detail.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  public oldOrdernNo: string; // 原始订单号
  private pid: number; // 商品详情 pid
  private sub: any; // 传递参数对象
  remark: ''; // 备注
  constructor(private _activatedRoute: ActivatedRoute,
              private router: Router,
              private productDetailService: ProductDetailService,
              private _notification: NzNotificationService) {
  }

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.pid = params['pid'];
      this._activatedRoute.queryParams.subscribe(queryParams => {
        this.oldOrdernNo = queryParams['orderNo'];
      });
    });

    this.getProductDetailFn();
  }

  productData: any = {
    productType: '',
  };

  // 商品详情
  getProductDetailFn() {
    return this.productDetailService.getProductDetailFn(this.pid).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.productData = resultData.data;
        }
      },
      err => {
        console.log('查询商品详情err....');
      });
  }

  // 监听获取子组件传来的 服务时长
  purchasetime: any;

  onPurchaseTime(val) {
    this.purchasetime = val;
  }

  /*
  * 提交订单
  */
  submitObj: any = {
    productName: '',// 商品名称
    useLength: this.purchasetime, // number 试用时长
    remark: this.remark || '',  // string 备注
    productId: this.pid // number 商品id
  };

  submitOrderFn(data: any) {
    this.submitObj = {
      productName: data.productName,
      useLength: this.purchasetime || 1,
      remark: this.remark || '',
      productId: this.pid
    };
    this.productDetailService.submitOrderFn(this.submitObj).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.router.navigate(['/page/contacts/payinfo', resultData.data]);
          // 1商品下架，2存在有效订单，4操作失败
          // if(resultData.data==1 || resultData.data==2||resultData.data==4){
          //   this._notification.create('error', resultData.msg,'');
          // }else if(resultData.data==3){//3 提交订单成功
          //   console.log(`返回的orderNo:${resultData.msg}`);
          //   //返回ordernNo 路由跳转支付页面
          //   this.router.navigate(['/page/payinfo',resultData.msg]);
          // }else{
          //   this._notification.create('error', '操作失败','');
          // }
        } else {
          this._notification.create('error', resultData.msg, '');
        }
      },
      err => {
        console.log('提交订单err....');
      });
  }

  /*
  * 续费订单
  *
  */
  renewalsObj: any = {
    orderNo: this.oldOrdernNo, // string 订单号
    useLength: this.purchasetime, // number 试用时长
    remark: this.remark,  // string 备注
    productId: this.pid // number 商品id
  };

  renewalsOrderFn(data: any) {
    this.renewalsObj = {
      orderNo: this.oldOrdernNo,
      useLength: this.purchasetime,
      remark: this.remark,
      productId: this.pid
    };
    this.productDetailService.renewalsOrderFn(this.renewalsObj).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          // 返回ordernNo 路由跳转支付页面
          this.router.navigate(['/page/contacts/payinfo', resultData.data]);
        } else {
          this._notification.create('error', resultData.msg, '');
        }
      },
      err => {
        console.log('续费订单err....');
      });
  }


  // 组件卸载的时候取消订阅
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
