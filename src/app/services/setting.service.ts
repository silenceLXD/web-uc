import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class SettingService {
  private apiBase = environment.apiBase;

  constructor(private http: Http) {
    this.getCookieDomain();
  }

  vcsSetting: any = {
    'VCS_TITLE': '云起云',
    'VCS_LOGO_IMG': 'assets/img/logo_white.png',
    'VCS_THEME_COLOR': 'navbarHeaderBlack',
    'UC_API_HOST': '',
    'WEBRTC_URL': '',
    'SET_COOKIE_DOMAIN': ''
  };

  getVcsSetting() {
    // console.log(this.vcsSetting);
    return this.vcsSetting;
  }

  // 获取cookie的domain；webrtc访问地址
  getCookieDomain() {
    return this.http.get(this.apiBase + '/uc/cookie/domain')
      .toPromise()
      .then(response => {
        const data = response.json();
        this.vcsSetting.SET_COOKIE_DOMAIN = `.${data.data.ucWebrtcDomain}`;
        this.vcsSetting.WEBRTC_URL = data.data.webrtcHost;
        this.vcsSetting.UC_API_HOST = data.data.ucHost;
      })
      .catch(err => {

      });
  }

  getMainHost() {
    const key = `mh_${Math.random()}`;
    const keyR = new RegExp(`(^|;)\\s*${key}=12345`);
    const expiredTime = new Date(0);
    const domain = document.domain;
    const domainList = domain.split('.');
    // 常见的域名后缀
    const domainArr = ['com', 'cn', 'com.cn', 'net', 'net.cn', 'org', 'org.cn'];

    const urlItems = [];
    // 主域名一定会有两部分组成
    urlItems.unshift(domainList.pop());
    // 慢慢从后往前测试
    while (domainList.length) {
      const nextKey = domainList[domainList.length - 1];
      if (this.isInArray(domainArr, nextKey)) {   // 存在
        urlItems.unshift(domainList.pop());
      } else {  // 不存在 break
        urlItems.unshift(domainList.pop());
        break;
      }
    }
    const mainHost = urlItems.join('.');
    const cookie = `${key}=${12345};domain=.${mainHost}`;
    document.cookie = cookie;
    // 如果cookie存在，则说明域名合法
    if (keyR.test(document.cookie)) {
      document.cookie = `${cookie};expires=${expiredTime}`;
      return '.' + mainHost;
    } else {
      return '';
    }
  }

  /**
   * 使用indexOf判断元素是否存在于数组中
   * @param {Object} arr 数组
   * @param {Object} value 元素值
   */
  isInArray(arr: any, value: string) {
    if (arr.indexOf && typeof(arr.indexOf) == 'function') {
      const index = arr.indexOf(value);
      if (index >= 0) {
        return true;
      }
    }
    return false;
  }
}
