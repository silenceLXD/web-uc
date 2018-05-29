import {Component, OnInit} from '@angular/core';
// import { Http } from '@angular/http';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {CommonService} from '@services/common.service';
import {SettingService} from '@services/setting.service';
import {TranslateService} from '@ngx-translate/core';

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  settingData: any;
  private lang = 'zh-CN';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private setting: SettingService,
              private translate: TranslateService) {
    this.settingData = setting.getVcsSetting();
    // 初始化配置
    this.initTranslateConfig();

    setTimeout(() => {
      commonService.setCookie('uc-api-host', this.settingData.UC_API_HOST);
    }, 100);
  }

  initTranslateConfig() {
    // 参数类型为数组，数组元素为本地语言json配置文件名
    this.translate.addLangs(['zh-CN', 'en']);
    // 设置默认语言
    this.translate.setDefaultLang(this.lang);
    // 检索指定的翻译语言，返回Observable
    this.translate.use(this.lang)
      .subscribe(() => {
        // ... do something
      });
  }

}
