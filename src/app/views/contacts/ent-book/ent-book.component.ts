import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {SettingService} from '@services/setting.service';
import {EntBookService} from '../ent-book.service';

@Component({
  selector: 'app-ent-book',
  templateUrl: './ent-book.component.html',
  styleUrls: ['./ent-book.component.css']
})
export class EntBookComponent implements OnInit {

  // 登录参数
  loginMsg = {
    roomNumber: '',
    password: '',
    loginRealName: ''
  };
  settingData: any; //获取设置文件数据
  webRtcUrl: any; //webrtc入会连接
  constructor(private http: HttpClient,
              private setting: SettingService,
              private entBookService: EntBookService,
              private commonService: CommonService) {
    this.settingData = setting.getVcsSetting();
  }

  ngOnInit() {
    this.getPathDataFn();
    this.loginMsg.loginRealName = this.commonService.getLoginMsg().realName;
    this.webRtcUrl = this.settingData.WEBRTC_URL;
  }

  /* 获取跳转链接所需参数 */
  getPathDataFn() {
    return this.entBookService.getPathDataFn().subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.loginMsg.roomNumber = resultData.data.roomNumber;
          this.loginMsg.password = resultData.data.password;
        }
      },
      err => {
        console.log(err);
      }
    );
  }


}
