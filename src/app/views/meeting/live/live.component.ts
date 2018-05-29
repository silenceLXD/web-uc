import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {LiveService} from '../live.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  // 是否可用
  isAvailableOne: boolean;
  public loginUserData = this.commonService.getLoginMsg();
  ENTID = this.loginUserData.entId;

  constructor(private http: HttpClient,
              private _activatedRoute: ActivatedRoute,
              private liveService: LiveService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.isAvailableOne = this.commonService.getAvailableOne();
    this.getLiveListFn();
  }

  liveListData: any;
  isHaveData = false;

  // 查询企业直播列表
  getLiveListFn() {
    this.liveService.getLiveListFn(this.ENTID).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          if (resultData.data.length) {
            this.isHaveData = true;
            this.liveListData = resultData.data;
          } else {
            this.isHaveData = false;
          }
        }
      },
      err => {
        console.log('在线状态 error...');
      });
  }
}
