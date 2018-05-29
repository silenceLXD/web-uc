import {Component, Injectable, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers} from '@angular/http';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';
import {Router, ActivatedRoute} from '@angular/router';
import {SettingService} from '@services/setting.service';

@Injectable()
export class CommonService {
  settingData: any;

  constructor(private _cookieService: CookieService,
              private http: Http,
              private router: Router,
              private setting: SettingService,
              private _activatedRoute: ActivatedRoute) {
    this.settingData = setting.getVcsSetting();
    // setTimeout(()=>{
    //   this.setCookie("uc-api-host",this.settingData.UC_API_HOST);
    // },100)

  }

  /* 写入cookie
   * @param
   set( name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean ): void;
  */
  setCookie(name: string, value: any, expires?: number) {
    if (this.checkCookie(name)) { //检测是否存在当前cookie，如果已存在则先删除再进行存储
      this._cookieService.delete(name, '/');
      // console.log(`deleteCookie==> ${name}`);
    }
    if (expires) {
      expires = expires / 60 / 60 / 24;
    } else {
      expires = 30;
    }
    this._cookieService.set(name, value, expires, '/', this.getMainHost());
    //settingData.SET_COOKIE_DOMAIN
  }

  /* 读取cookie
   * @param
   * name string  变量名
  */
  getCookie(name: string) {
    return this._cookieService.get(name);
  }

  /* 判断是否存在cookie
   * @param
   * name string  变量名
   * 返回 boolean
   * check( name: string ): boolean;
  */
  checkCookie(name: string) {
    return this._cookieService.check(name);
  }

  /* 删除cookie
   * @param
   * name string  变量名
   * delete( name: string, path?: string, domain?: string ): void;
  */
  deleCookie(name: string) {
    this._cookieService.delete(name, '/', this.getMainHost());
  }

  /* 删除所有cookie
   * @param
   * path 路径
   * domain 域
   * deleteAll( path?: string, domain?: string ): void;
  */
  deleAllCookie() {
    this._cookieService.deleteAll('/', this.getMainHost());
  }

  // 解码utf8
  decodeUTF8(str) {
    if (str) {
      return str.replace(/(\\u)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
        return String.fromCharCode(parseInt($2, 16));
      });
    } else {
      return '';
    }
  }

  /* 获取路径
   * @param
  */
  getPath() {
    const curWwwPath = window.document.location.href;
    const pathName = window.document.location.pathname;
    const pos = curWwwPath.indexOf('#');
    const localhostPaht = curWwwPath.substring(0, pos);
    return localhostPaht;
  }

  getOrigin() {
    const curWwwPath = window.document.location.origin;
    return curWwwPath;
  }

  /* 获取url参数
   * @param
   * name string  要获取的参数名
  */
  getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    // if (r != null) return unescape(r[2]); return null;
    if (r != null) {
      return r[2];
    }
    return null;
  }

  /**
   * 获取hash参数
   */
  getHashParameter(key) {
    const params = this.getHashParameters();
    return params[key];
  }

  getHashParameters() {
    const url = location.hash;
    const params = {};
    if (+url.indexOf('?') !== -1) {
      const allarr = (location.hash || '').replace(/^\#/, '').split('?');
      const arr = allarr[1].split('&');
      for (let i = 0; i < arr.length; i++) {
        const data = arr[i].split('=');
        if (+data.length === 2) {
          params[data[0]] = data[1];
        }
      }
    }
    return params;
  }

  /*
  * 从localstorage中获取登录的用户信息
  */
  getLoginMsg() {
    if (localStorage.getItem('uc_loginData')) {
      return JSON.parse(localStorage.getItem('uc_loginData'));
    } else if (this.getCookie('localStorage_uc_loginData')) {
      const objData = JSON.parse(this.getCookie('localStorage_uc_loginData'));
      if (objData.entName) {
        objData.entName = this.decodeUTF8(objData.entName);
      }
      objData.realName = this.decodeUTF8(objData.realName);
      localStorage.setItem('uc_loginData', JSON.stringify(objData));

      return JSON.parse(localStorage.getItem('uc_loginData'));
    } else {
      return '';
    }
  }

  /*
  * 退出登录
  * 删除当前用户登录时所存储的cookie以及localstorage
  * 并返回到登录页面
  */
  deletAllLoginData() {
    this.deleAllCookie();//清除cookies
    this.router.navigateByUrl('login');//跳回登录
    localStorage.clear();//清除localStorage
    setTimeout(() => {
      this.setCookie('uc-api-host', this.settingData.UC_API_HOST);
    }, 100);
  }

  /*
  * json对象转get请求参数格式
  */
  formObject(arr: object) {
    let str = '?';
    for (const i in arr) {
      if (arr) {
        str += i + '=' + arr[i] + '&';
      }
    }
    const formStr = str.substring(0, str.lastIndexOf('&'));
    return formStr;
  }

  /*
    日期格式转换
    yyyy-MM-dd
  */
  formatDate(date: any, line?: string) {
    if (date) {
      date = new Date(date);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      if (line) {
        return y + line + m + line + d;
      } else {
        return y + '-' + m + '-' + d;
      }

    } else {
      return '';
    }
  }

  /*
    日期格式转换
    HH:mm
  */
  formatDateTime(date: any) {
    if (date) {
      date = new Date(date);
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let mi = date.getMinutes();
      mi = mi < 10 ? ('0' + mi) : mi;

      return h + ':' + mi;
    } else {
      return '';
    }
  }

  /*
    获取传入时间date ，days天之前的日期或days天之后的日期
    例： days=7 //获取7天之后的日期
        days=-7 //获取7天之前的日期
  */
  fun_date(date, days) {
    const date1 = date;
    const time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate(); // time1表示当前时间
    const date2 = new Date(date1);
    date2.setDate(date1.getDate() + days);
    const date2_y = date2.getFullYear();
    let date2_m: any = date2.getMonth() + 1;
    date2_m = date2_m < 10 ? '0' + date2_m : date2_m;
    let date2_d: any = date2.getDate();
    date2_d = date2_d < 10 ? '0' + date2_d : date2_d;

    const time2 = date2_y + '-' + date2_m + '-' + date2_d;
    return time2;
  }

  /*
  * 传入数字 小于10的 补0
  */
  addZero(number) {
    return number < 10 ? '0' + number : number;
  }

  /*
  * 获取当前 年月前n个月，并将每个月日期显示追加到select框中
  * addMonthFn(dtstr, n)
  *  参数： dtstr 为当前年月，格式如时间戳;
            n 为向前推移 n 个月
    返回值：optionstr 向select框中追加的option拼接字符串
   */
  addMonthFn(dtstr, n) {
    let year = dtstr.getFullYear();
    let mouth = dtstr.getMonth() + 2;

    const dt = new Date(year, mouth);
    dt.setMonth(dt.getMonth() - n);
    const month = dt.getMonth();
    let optionstr = '';
    let days; // 定义当月的天数；
    const optionsArr = [];
    for (let i = 0; i < n; i++) {
      if (+mouth === 1) {
        mouth = 13;
        mouth -= 1;
        year -= 1;
      } else {
        mouth -= 1;
      }
      if (mouth < 10) {
        mouth = '0' + mouth;
      }

      if (+mouth === 2) {
        // 当月份为二月时，根据闰年还是非闰年判断天数
        days = year % 4 == 0 ? 29 : 28;
      } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
        // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31;
      } else {
        // 其他月份，天数为：30
        days = 30;
      }
      // option +='<option value='+year+'-'+mouth+' data-days='+days+'>' + year + '年' + mouth + '月</option>';
      optionstr = year + '-' + mouth;
      const optionobj = {'date': optionstr, 'days': days};
      optionsArr.push(optionobj);
    }
    // optionstr = option;
    return optionsArr;
  }

  /**
   * 获取传入kb字节 返回GB
   * */
  getByteCode(byte: any) {
    if (+byte === 0 || byte == undefined) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(byte) / Math.log(k));
    return (byte / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }

  /**
   * 获取传入的 秒 返回 分钟数
   * */
  getTimeCode(number: any) {
    const minutes = Math.floor(number / 60); // 计算分钟数
    const second = number - minutes * 60; // 总秒数-已计算的分钟数

    const outputVal = this.addZero(minutes) + '分' + this.addZero(second) + '秒';
    return outputVal;

  }

  /* 计算传入时间与当前时间之前的时间差
   * beginTime ：传入时间   格式为时间戳（毫秒数）
   * */
  longTime(beginTime: any) {
    var date = new Date().getTime();
    var longTimes = date - beginTime;
    if (longTimes > 0) {

      //计算出相差天数
      var leavedays = longTimes % (30 * 24 * 3600 * 1000);
      var days = Math.floor(leavedays / (24 * 3600 * 1000));

      //计算出小时数
      var leavehours = leavedays % (24 * 3600 * 1000);     //计算天数后剩余的毫秒数
      var hours = Math.floor(leavehours / (3600 * 1000));

      //计算相差分钟数
      var leaveminutes = leavehours % (3600 * 1000);         //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leaveminutes / (60 * 1000));

      //计算相差秒数
      var leaveseconds = leaveminutes % (60 * 1000);       //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leaveseconds / 1000);

      if (days == 0) {
        if (hours == 0) {
          var showLongTime = minutes + '分钟';
        } else {
          var showLongTime = hours + '小时' + minutes + '分钟';
        }
      } else {
        var showLongTime = days + '天' + hours + '小时' + minutes + '分钟';
        //var showLongTime = days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";
      }

    } else {
      var showLongTime = '0分钟';
    }
    return showLongTime;
  }

  /* getLocalTime(ns)  ns时间戳
 * 将时间戳转为 yyyy-MM-dd hh:mm
 * */
  getLocalTime(ns: any) {
    const d = new Date(ns);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();
    // var day=d.getDay();
    return year + '-' + this.addZero(month) + '-' + this.addZero(date) + ' ' + this.addZero(hour) + ':' + this.addZero(minute);
  }

  /**
   * 下载
   * @paramt  url   传入下载地址
   * @paramt  name  传入文件名
   * */
  downloadExport(dataUrl: any, name: any) {
    const url = environment.apiBase + dataUrl;
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    eleLink.download = name;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    const blob = new Blob([url]);
    eleLink.href = URL.createObjectURL(blob);
    eleLink.href = url;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }


  bytesToSize(bytes) {
    // var bytes = bytes/1024;
    let flow = '';
    // 如果流量小于1MB.则显示为KB
    if (bytes / 1024 < 1024) {
      const kb_Flow = (bytes / 1024) > 0 ? (bytes / 1024) : 0;
      flow = kb_Flow.toFixed(2) + 'KB';
    } else if (bytes / 1024 >= 1024 && bytes / 1024 / 1024 < 1024) {
      // 如果流量大于1MB且小于1GB的则显示为MB
      const mb_Flow = (bytes / 1024 / 1024) > 0 ? (bytes / 1024 / 1024) : 0;
      flow = mb_Flow.toFixed(2) + 'MB';
    } else if (bytes / 1024 / 1024 >= 1024) {
      // 如果流量大于1Gb
      const gb_Flow = bytes / 1024 / 1024 / 1024;
      // toFixed(1);四舍五入保留一位小数
      flow = gb_Flow.toFixed(2) + 'GB';
    } else {
      flow = '0.00KB';
    }
    return flow;
  }

  /* 登录时设置需要本地存储的数据 */
  loginSetData(resData: any) {
    const expires = resData.expires_in;
    // 登录成功保存 token数据 cookie
    this.setCookie('uc_access_token', resData.access_token, expires); // 请求token
    this.setCookie('uc_expires_in', resData.expires_in, expires); // token有效期
    this.setCookie('uc_token_type', resData.token_type, expires); // token类型
    this.setCookie('uc_refresh_token', resData.refresh_token); // 刷新token
    this.setCookie('uc_realName', resData.realName, expires); // 登录者名称
    this.setCookie('uc_isLogin', 'true', expires); // uc已登陆
    const xmppCookieData: any = {
      'realName': resData.realName,
      'userId': resData.userId,
      'entId': resData.entId,
      // 'access_token': resData.access_token,
      // 'refresh_token': resData.refresh_token,
      'webrtcAddress': resData.webrtcAddress,
      'webrtcXmppIp': resData.webrtcXmppIp,
      'xmppPassword': resData.xmppPassword,
      'xmppServer': resData.xmppServer,
      'xmppUsername': resData.xmppUsername
    };
    this.setCookie('xmppCookieData', JSON.stringify(xmppCookieData)); // 连接xmpp相关数据

    // localstorage存储
    if (+resData.roleType === 1 || +resData.roleType === 2) {
      localStorage.setItem('switchflag', '0');
    } else if (+resData.roleType === 3) {
      localStorage.setItem('switchflag', '1');
    } else {
      localStorage.setItem('switchflag', '2');
    }
    localStorage.setItem('uc_loginData', JSON.stringify(resData)); // 登录返回信息

    // 判断是否跳转 webrtc
    const webType = this.getCookie('fromWeb');
    const liveId = this.getCookie('liveId');
    if (webType === 'webrtc') {
      this.deleCookie('fromWeb');
      // window.document.location.href = window.document.location.origin + '/webrtc';
      window.document.location.href = this.settingData.WEBRTC_URL;
    } else if (webType === 'live') {
      this.deleCookie('fromWeb');
      // window.document.location.href = window.document.location.origin + '/uc/#/watch-live/' + liveId;
      this.router.navigate(['/watch-live', liveId]);
    } else {
      // 登录成功进行判断用户是否首次登录 首次登录 1：是 0：否
      if (+resData.firstLogin === 1) {
        this.router.navigate(['/bind', resData.userId]); // 跳转到手机绑定，重置密码页面['/product',1]
      } else {
        this.router.navigate(['/page']); // 跳转到index主页
      }
    }

  }

  // 判断浏览器类型
  BrowserType() {
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera浏览器
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; // 判断是否IE浏览器
    const isEdge = userAgent.indexOf('Edge') > -1; // 判断是否IE的Edge浏览器
    const isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
    const isSafari = userAgent.indexOf('Safari') > -1 && +userAgent.indexOf('Chrome') === -1; // 判断是否Safari浏览器
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; // 判断Chrome浏览器

    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      const fIEVersion = parseFloat(RegExp['$1']);
      if (+fIEVersion === 7) {
        return 'IE7';
      } else if (+fIEVersion === 8) {
        return 'IE8';
      } else if (+fIEVersion === 9) {
        return 'IE9';
      } else if (+fIEVersion === 10) {
        return 'IE10';
      } else if (+fIEVersion === 11) {
        return 'IE11';
      } else { // IE版本过低
        return '0';
      }
    } // isIE end

    if (isFF) {
      return 'FF';
    }
    if (isOpera) {
      return 'Opera';
    }
    if (isSafari) {
      return 'Safari';
    }
    if (isChrome) {
      return 'Chrome';
    }
    if (isEdge) {
      return 'Edge';
    }
  }

  //判断是否pc
  IsPC() {
    const userAgentInfo = navigator.userAgent;
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  /* 判断是否安装了flash插件 */
  flashPlayer() {
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera浏览器
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; // 判断是否IE浏览器
    if (isIE) {
      return new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    } else {
      return navigator.plugins['Shockwave Flash'];
    }
  }

  /* js获取主域名(根域名)  */
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

  /* 通过 key 判断 list元素是否在数组对象arr内
    * 如果存在 则移除
    * @param arr<Array> 目标数组
    * @param list<object> 当前list
    * @param key<string> 判断关键字段
    */
  removeListByKey(arr, list, key) {
    var i = arr.length;
    while (i--) {
      if (arr[i][key] === list[key]) {
        arr.splice(i, 1);
        return true;
      }
    }
    return arr;
  }
  /*********权限处理start**********/
  // serviceState 0-正常开通 1-已冻结 2-已过期 3-已购买,待支付,无服务 4-已购买,已支付,待开通,无服务 5-未购买,未支付,无服务 6-终止服务
  // roleId 1,2 企业管理员 3 企业用户
  getAvailableOne() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([5, 3, 4, 2, 6, 1].indexOf(+serviceState) === -1) && !([1, 2, 3].indexOf(+roleId) === -1);
    return isAvailable;
  }

  getAvailableTwo() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([5, 3, 4, 2, 6].indexOf(+serviceState) === -1) && !([1, 2, 3].indexOf(+roleId) === -1);
    return isAvailable;
  }

  getAvailableThree() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([5, 3, 4, 2, 6].indexOf(+serviceState) === -1) && !([1, 2].indexOf(+roleId) === -1);
    return isAvailable;
  }

  getAvailableFour() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([5, 3, 4, 2].indexOf(+serviceState) === -1) && !([1, 2, 3].indexOf(+roleId) === -1);
    return isAvailable;
  }

  getAvailableFive() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([6].indexOf(+serviceState) === -1) && !([1, 2, 3].indexOf(+roleId) === -1);
    return isAvailable;
  }

  getAvailableSix() {
    const serviceState = localStorage.setEntServiceData;
    const roleId = this.getLoginMsg().roleType;
    const isAvailable = !([1].indexOf(+serviceState) === -1) && !([1, 2, 3].indexOf(+roleId) === -1);
    return isAvailable;
  }

  /*********权限处理end**********/

  // 重新定向到原路由
  redirectTo(uri: string, minUrl: string = '/page/loading', index?: number) {
    this.router.navigate([minUrl], {skipLocationChange: true}).then(() => {
        if (uri === '/page/noJurisdiction') {
          this.router.navigate([uri], {queryParams: {noJurisdiction: index}});
        } else {
          this.router.navigate([uri]);
        }
      }
    );
  }
}
