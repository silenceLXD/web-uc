import {Component, OnInit, OnDestroy, EventEmitter, Output, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as $ from 'jquery';
import {SetupThreeService} from "./setup-three.service";

@Component({
  selector: 'setup-three',
  template: `
    <h4 class="setup-title"><span class="setup-icon setup-edit-icon"></span> 设置新密码</h4>
    <div class="">
      <form class="form-horizontal" name="setupThreeForm" novalidate #setupThreeForm="ngForm">
        <div class="form-group">
          <div class="col-xs-12">
            <input type="password" class="form-control input-radius" name="newPassword"
                   [(ngModel)]="accountData.newPassword"
                   placeholder="输入新密码" required maxlength="20" minlength="6" #newPassword="ngModel">
            <div *ngIf="newPassword.errors && (newPassword.dirty || newPassword.touched)" class="error">
              <span [hidden]="!newPassword.errors.required">密码是必填项</span>
              <span [hidden]="!newPassword.errors.minlength">密码至少6位</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <input type="password" class="form-control input-radius" name="repeatPassword"
                   [(ngModel)]="accountData.repeatPassword"
                   placeholder="再次输入新密码" required maxlength="20" minlength="6" #repeatPassword="ngModel">
            <div *ngIf="repeatPassword.errors && (repeatPassword.dirty || repeatPassword.touched)" class="error">
              <span [hidden]="!repeatPassword.errors.required">密码是必填项</span>
              <span [hidden]="!repeatPassword.errors.minlength">密码至少6位</span>
            </div>
          </div>
        </div>
        <div class="error">{{errorMsg}}</div>
        <div class="form-group">
          <div class="col-xs-12">
            <button type="submit" [disabled]="!setupThreeForm.valid" name="button" class="btn btn-svoc setup-btn"
                    (click)="toNextStep()">完成
            </button>
            <div style="margin-top: 10px;">
              <p class="pull-right forgetpsd" style="color:#000;">已有账号？<a routerLink="/login">登 录</a></p>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./forget-psd.component.css']
})
export class SetupThreeComponent implements OnInit {

  @Input() inputParentData: any;
  @Output() outPutSetupThreeData: EventEmitter<any> = new EventEmitter();//子传父
  constructor(private http: HttpClient,
              private setupThreeService: SetupThreeService) {
  }

  ngOnInit() {
  }

  errorMsg: any;
  accountData: any = {
    newPassword: '',//新密码
    repeatPassword: '',//重复新密码
    userId: ''//用户ID
  };

  // 下一步
  toNextStep() {
    this.accountData.userId = this.inputParentData.userId;
    this.setupThreeService.toNextStep(this.accountData).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this.outPutSetupThreeData.emit(this.inputParentData);
        } else {
          this.errorMsg = resData.msg;
        }
      },
      err => {
        console.log(err);
      });
  }

}
