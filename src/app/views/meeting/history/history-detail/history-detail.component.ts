import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {environment} from '../../../../../environments/environment';
import {HistoryDetailService} from '../../history-detail.service';
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {

  roleId = this.commonService.getLoginMsg().roleType; // 8是个人用户
  private cid: number; // 会议的appointmentId
  private sub: any; // 传递参数对象
  public appointType: number; // 1 历史会议；2 历史预约
  // isAppointType
  public loginUserData = this.commonService.getLoginMsg();
  userId: any = this.loginUserData.userId;

  constructor(private _activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private historyDetailService: HistoryDetailService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.cid = params['cid'];
      this.appointType = params['type'];
    });

    this.operationDetailFn();
  }

  weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  viewWeeks: any;
  endviewWeeks: any;

  detailsData: any = {
    conference: {
      appointmentStatus: ''
    }
  };

  operationDetailFn() {
    this.historyDetailService.operationDetailFn(this.appointType, this.cid).subscribe(
      res => {
        const resultData: any = res;
        this.detailsData = resultData.data;
        const startdt = new Date(this.detailsData.conference.startTime);
        this.viewWeeks = this.weekDay[startdt.getDay()];
        const enddt = new Date(this.detailsData.conference.endTime);
        this.endviewWeeks = this.weekDay[enddt.getDay()];
      },
      err => {
        console.log(err);
      });
  }


  //下载会议日志 modal
  historyLogModal = false;
  logData: any = [];

  checkLogFn(cid: any) {
    this.historyLogModal = true;
    this.historyDetailService.checkLogFn(cid, this.scrollLogNum).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          resultData.data.forEach(item => {
            this.logData.push(item);
          });
          // this.logData = resultData.data;
        }
      },
      err => {
        console.log(err);
      });
  }

  // 下载会议日志
  downloadLogFn() {
    const url = this.historyDetailService.downloadLogFn(this.cid, this.userId);
    this.commonService.downloadExport(url, '会议日志');
    this.historyLogModal = false;
  }

  // 滚动加载会议日志
  scrollLogNum: number = 1;
  noMoreLogData: boolean = false;
  onScrollDown() {
    if(!this.noMoreLogData){
      this.scrollLogNum++;
      this.historyDetailService.checkLogFn(this.cid, this.scrollLogNum).subscribe(
        res => {
          const resultData: any = res;
          if (+resultData.code === 200) {
            if(resultData.data.length>0){
              resultData.data.forEach(item => {
                this.logData.push(item);
              });
            }else{
                this.noMoreLogData = true;
            }
          }
        },
        err => {
          console.log(err);
        });
    }
  }

}
