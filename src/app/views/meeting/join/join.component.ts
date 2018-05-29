import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@services/common.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SettingService} from '@services/setting.service';
import {JoinService} from '../join.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  // 是否可用
  isAvailableOne: boolean;
  isAvailableTwo: boolean;
  isAvailableThree: boolean;

  joinFormModel: FormGroup;
  webRtcUrl: string; // webrtc入会连接
  vmrNumber: string; // 会议号
  isCanJoin: boolean;
  errorStateNum: any; // 加入会议室出错的状态

  settingData: any; // 获取设置文件数据

  constructor(private _notification: NzNotificationService,
              private http: HttpClient,
              private fb: FormBuilder,
              private setting: SettingService,
              private joinService: JoinService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.settingData = this.setting.getVcsSetting();
    this.isAvailableOne = this.commonService.getAvailableFour();
    this.isAvailableTwo = this.commonService.getAvailableFive();
    this.isAvailableThree = this.commonService.getAvailableSix();
    this.joinFormModel = this.fb.group({
      vmrNumber: '',
    });
    this.isCanJoin = false;
    this.joinFormModel.get('vmrNumber').valueChanges
      .debounceTime(50)
      .subscribe(
        value => {
          if (value === '') {
            // this._notification.create('error', '请输入会议号！', '');
            this.errorStateNum = 100; // 随便赋值非0,1,2,4
            this.isCanJoin = false;
          } else {
            this.checkVmrFn(value);
          }
        }
      );
  }

  // 点击加入会议会报错的情况
  errorMsg() {
    if (+this.errorStateNum === 0) {
      this._notification.create('error', '无此会议号！', '');
    } else if (+this.errorStateNum === 1) {
      this._notification.create('error', '预约会议未开始！', '');
    } else if (+this.errorStateNum === 2 && this.isAvailableOne) {
      this._notification.create('error', '无法加入会议！', '');
    } else if (+this.errorStateNum === 4 && this.isAvailableThree) {
      this._notification.create('error', '企业已冻结！', '');
    } else {
      this._notification.create('error', '请输入会议号！', '');
    }
  }

  // 点击加入会议能进入的情况
  sureJoinFn(number: any) {
    if (number) {
      if (this.isCanJoin) {
        this.joinVmrFn(number);
        this.webRtcUrl = `${this.settingData.WEBRTC_URL}/#conference=${number}`;
      }
    }
  }

  // 加入会议
  joinVmrFn(number: any) {
    return this.joinService.joinVmrFn(number).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '加入成功', '');
        } else {
          this._notification.create('error', resultData.msg, '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // 检查会议号
  checkVmrFn(number: any) {
    // 根据会议室号检验用户是否可以入会
    return this.joinService.checkVmrFn(number).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          if (+resultData.data === 0) {
            // this._notification.create('error', '无此会议号！', '');
            this.errorStateNum = 0;
            this.isCanJoin = false;
          } else if (+resultData.data === 1) {
            // this._notification.create('error', '预约会议未开始', '');
            this.errorStateNum = 1;
            this.isCanJoin = false;
          } else if (+resultData.data === 2 && this.isAvailableOne) {
            // this._notification.create('error', '无法加入会议！', '');
            this.errorStateNum = 2;
            this.isCanJoin = false;
          } else if (+resultData.data === 4 && this.isAvailableThree) {
            // this._notification.create('error', '企业已冻结！', '');
            this.errorStateNum = 4;
            this.isCanJoin = false;
          } else if (+resultData.data === 3) {
            this.isCanJoin = true;
          }
        } else {
          this._notification.create('error', resultData.msg, '');
          this.isCanJoin = false;
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
