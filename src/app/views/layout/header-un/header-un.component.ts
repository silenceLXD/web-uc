import {Component, OnInit} from '@angular/core';
import {SettingService} from '@services/setting.service';

@Component({
  selector: 'app-header-un',
  templateUrl: './header-un.component.html',
  styleUrls: ['./header-un.component.css']
})
export class HeaderUnComponent implements OnInit {
  settingData: any; // 获取设置文件数据
  webrtcAnonymousUrl: string; // webrtc访问地址
  constructor(private settingService: SettingService) {
    this.settingData = this.settingService.getVcsSetting();
  }

  ngOnInit() {
    setTimeout(() => {
      this.webrtcAnonymousUrl = `${this.settingData.WEBRTC_URL}/#type=1`;
    }, 1000);

  }
}
