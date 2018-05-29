import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';
import {MeetingControlBtnService} from './meeting-control-btn.service';

@Component({
  selector: 'meeting-control-btn',
  template: `
    <a href="javascript:;" (click)="checkMeetingFn(meetingData)" class="btn btn-svoc radius20 contorl-btn">会议控制</a>
  `,
  styles: [`
    button.code-btn {
      background: transparent;
      border: none;
    }
  `]
})
export class MeetingControlBtnComponent implements OnInit, OnDestroy {
  @Input() meetingData: any;

  constructor(private router: Router,
              private meetingControlBtnService: MeetingControlBtnService,
              private _notification: NzNotificationService) {
  }

  ngOnInit() {
  }


  // 根据cid判断会议是否已结束 返回值为true/false
  checkMeetingFn(cid: any) {
    return this.meetingControlBtnService.checkMeetingFn(cid).subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          if (resData.data) {
            this.router.navigate(['/page/meeting/meeting-control', cid]);
          } else {
            this._notification.create('error', '此会议已结束', '');
          }
        }
      },
      err => {
        console.log(err);
      });
  }


// this.router.navigate(['/bind', resData.userId]);
  // 销毁组件时清除定时器
  ngOnDestroy() {

  }

}
