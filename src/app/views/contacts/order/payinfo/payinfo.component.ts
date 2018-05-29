import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {CommonService} from '@services/common.service';
import {EventBusService} from '@services/event-bus.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {PayinfoService} from '../../payinfo.service';

@Component({
  selector: 'app-payinfo',
  templateUrl: './payinfo.component.html',
  styleUrls: ['./payinfo.component.css']
})
export class PayinfoComponent implements OnInit, OnDestroy {
  public loginUserData = this.commonService.getLoginMsg();
  ENTID = this.loginUserData.entId; // 登录者entId
  USERID = this.loginUserData.userId; // 登录者userid

  private orderNo: number; // 订单号 orderorderNo
  private sub: any; // 传递参数对象
  // 账户和支付宝的选择
  ableSurePayFn: any = {
    balancePay: false,
    alipayPay: false
  };
  ablePayBool = true;

  constructor(private _activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private element: ElementRef,
              private commonService: CommonService,
              private _eventBus: EventBusService,
              private payinfoService: PayinfoService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.orderNo = params['orderNo'];
    });
    this.getOrderDetailFn();

    this.getAccountMoney();
    this.setAbleSurePayFn();
    // if(this.chooseBalance){
    //   if(this.accountData >= this.orderdata.amount){
    // 		this.aliPayAmount = this.orderdata.amount - this.accountData;
    // 	}
    // }
  }

  isshowOrderDetail = false;//默认不显示订单详情
  ischeckedPay = false;//默认不现实余额支付
  // 根据订单号orderNo查询订单详情
  orderdata: any = {//订单详情数据
    orderState: '',
    product: {
      communicationPrice: '',
      detailList: []
    },
  };

  getOrderDetailFn() {
    return this.payinfoService.getOrderDetailFn(this.orderNo).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.orderdata = resultData.data;
        }
      },
      err => {
        console.log('查询订单详情err....');
      });
  }

  //根据企业id获取企业账户可用余额
  accountData: any = 0;//余额
  getAccountMoney() {
    this.payinfoService.getAccountMoney(this.ENTID).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.accountData = resultData.data;
        }
      },
      err => {
        console.log(err);
      });
  }

  /************* 第二种支付方式 余额支付 金额 **********/
    // aliPayAmount = 0;
  payMoney: any = {'balancePay': 0, 'alipayPay': 0};

  //余额支付
  chooseBalance = false; // 是否选择余额支付
  chooseBalanceFn(ischecked: any) {
    this.ableSurePayFn.balancePay = ischecked;
    if (ischecked) {
      //if 余额>=订单金额
      if (this.accountData >= this.orderdata.amount) {
        //余额支付金额=订单金额
        this.payMoney.balancePay = this.orderdata.amount;
        this.payMoney.alipayPay = 0;
      } else {
        //余额支付金额=账号余额
        this.payMoney.balancePay = this.accountData;
      }
    } else {
      this.payMoney.balancePay = 0;
      //支付宝支付金额=订单金额
      this.payMoney.alipayPay = this.orderdata.amount;
    }
    this.setAbleSurePayFn();
  }

  //支付宝支付
  chooseAlipayFn(ischecked: any) {
    this.ableSurePayFn.alipayPay = ischecked;
    if (ischecked) {
      //支付宝支付金额=订单金额-余额支付金额
      this.payMoney.alipayPay = this.orderdata.amount - this.payMoney.balancePay;
    } else {
      this.payMoney.alipayPay = 0;
    }
    this.setAbleSurePayFn();
  }

  // 确认支付按钮的禁用
  setAbleSurePayFn() {
    if (this.ableSurePayFn.alipayPay) {
      this.ablePayBool = false;
    } else {
      if (!this.ableSurePayFn.balancePay) {
        this.ablePayBool = true;
      } else {
        this.ablePayBool = this.accountData < this.orderdata.amount;
      }
    }
  }

  //确认支付
  returnHtml: any;

  surePayFn() {
    let balanceData = {
      orderNo: this.orderdata.orderNo,//订单号
      receipts: this.payMoney.balancePay//本次收款金额
    };
    let total = parseFloat(this.payMoney.balancePay) + parseFloat(this.payMoney.alipayPay);//支付总额
    /*if 余额支付金额==订单金额  直接走账户支付方法
      消费类型:consumeType 7-订单充值
    */
    if (this.payMoney.balancePay == this.orderdata.amount) {
      this.payinfoService.surePayFnBalance(this.orderdata.orderNo, balanceData).subscribe(
        res => {
          const resultData: any = res;
          if (+resultData.code === 200) {
            this._eventBus.setServiceSecondsChange.emit();
            this._notification.create('success', resultData.msg, '');
            this.router.navigateByUrl('/page/contacts/order-list');
          } else {
            this._notification.create('error', resultData.msg, '');
          }
        },
        err => {
          console.log(err);
        });
    } else if (total < this.orderdata.amount && total != 0) {
      this._notification.create('error', '账户余额不足', '');
    } else {//支付宝支付方法entId,alipayPay,userId,orderNo,amount,productType
      // entid，充值金额，userid，订单号，type(支付类型：1付款 0其他)，payable (总的订单金额)，productType(商品类型： 2付款 3其他)
      let aliPayStr = this.ENTID + ',' + this.payMoney.alipayPay + ',' + this.USERID + ',' + this.orderdata.orderNo + ',1,' + this.orderdata.amount + ',' + this.orderdata.productType;
      let postData = {'str': aliPayStr};
      this.payinfoService.surePayFnAipay(this.payMoney.alipayPay, postData).subscribe(
        res => {
          let resultData: any = res;
          if (resultData.code == '200') {
            this.returnHtml = this.sanitizer.bypassSecurityTrustHtml(resultData.data);
            setTimeout(() => {
              this.element.nativeElement.querySelector('#resultHtml').children[0].submit();
            }, 100);
          }
        },
        err => {
          console.log(err);
        });
    }
  }

  //组件卸载的时候取消订阅
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
