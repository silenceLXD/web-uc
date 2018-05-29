import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {SettingService} from '@services/setting.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {ScheduleDetailService} from '../schedule-detail.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit, OnDestroy {
  // 是否可用
  isAvailableOne: boolean;
  private appointmentId: number; // 会议的appointmentId
  private sub: any; // 传递参数对象

  settingData: any; //获取设置文件数据
  webRtcUrl: any; //webrtc入会连接
  constructor(private _activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private commonService: CommonService,
              private scheduleDetailService: ScheduleDetailService,
              private setting: SettingService,
              private _notification: NzNotificationService) {
    this.settingData = setting.getVcsSetting();
  }

  ngOnInit() {
    this.webRtcUrl = this.settingData.WEBRTC_URL;
    this.isAvailableOne = this.commonService.getAvailableOne();
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.appointmentId = params['mid'];
    });
    this.operationDetailFn();
  }

  /*** 点击会议名称 查看会议详情  根据appointmentId查询**/
  detailsData: any = {
    appointment: {
      appointmentType: ''
    }
  };
  conferenceImg: any;
  srcContent: any;
  copyContent: any;
  liveContent: any;
  weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  weeks: any;

  operationDetailFn() {
    this.conferenceImg = `${environment.apiBase}/uc/appointments/${this.appointmentId}/code`;//会议二维码图片初始化
    this.srcContent = `${this.commonService.getPath()}#/watch-live/${this.appointmentId}`;
    this.scheduleDetailService.operationDetailFn(this.appointmentId).subscribe(
      res => {
        const resultData: any = res;
        this.detailsData = resultData.data;

        const dt = new Date(this.detailsData.appointment.startTime);
        this.weeks = this.weekDay[dt.getDay()];

        /* 复制展示内容 拼接 start */
        this.copyContent =
          `会议名称:${resultData.data.appointment.appointmentName};
        会议号:${resultData.data.appointment.appointmentNumber};
        密码:${resultData.data.appointment.hostPwd};
        会议开始时间:北京时间${this.commonService.getLocalTime(resultData.data.appointment.startTime)}(${this.weeks});
        入会链接:${this.webRtcUrl}?conference=${this.detailsData.appointment.appointmentNumber};`;
      },
      err => {
        console.log(err);
      });
  }

  // 复制会议内容
  toClipboard() {
    this._notification.create('success', '复制成功', '');
  }

  //组件卸载的时候取消订阅
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
