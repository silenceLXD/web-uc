import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonService} from '@services/common.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {RechargeService} from '../recharge.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit, OnDestroy {
  public loginUserData = this.commonService.getLoginMsg();
  ENTID = this.loginUserData.entId;//loginUserData.entId
  USERID = this.loginUserData.userId;//loginUserData.userId
  receivable: any;
  unReceivable: any;

  constructor(private http: HttpClient,
              private element: ElementRef,
              private _activatedRoute: ActivatedRoute,
              private commonService: CommonService,
              private rechargeService: RechargeService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService,
              private sanitizer: DomSanitizer) {
  }

  rechargeMoney: any = 10000;//默认充值金额选择
  ngOnInit() {
    this.unReceivable = this._activatedRoute.params.subscribe(params => {
      this.receivable = params['receivable'];
    });
    if (this.receivable) {
      this.inputMoney = this.receivable;
      this.inputMoneyFn(this.inputMoney);
    } else {
      this.inputMoney = '';
    }
  }

  ngOnDestroy() {
    this.unReceivable.unsubscribe();
  }

  //充值金额切换
  changeMoney = function (money: any) {
    this.rechargeMoney = money;
    this.inputMoney = '';
  };
  inputMoney: any;
  inputMoneyFn = function (money: any) {
    this.rechargeMoney = money;
  };
  returnHtml: any;

  goAliPayFn() {
    // entid，充值金额，userid，0，type(支付类型：1付款 0其他)，payable (总的订单金额)，productType(商品类型： 2付款 3其他)
    const aliPayStr = this.ENTID + ',' + this.rechargeMoney + ',' + this.USERID + ',0,0,0,3';
    const postData = {'str': aliPayStr};
    // let aliPayStr = this.ENTID + ',' + this.rechargeMoney + ',' + this.USERID + ',0,0,0.01';
    this.rechargeService.goAliPayFn(this.rechargeMoney, postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
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
