import {Component, OnInit, ElementRef, AfterContentInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {AuthService} from '@services/auth.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {Strophe} from 'strophe.js';
import {WatchLiveService} from "./watch-live.service";

@Component({
  selector: 'app-watch-live',
  templateUrl: './watch-live.component.html',
  styleUrls: ['./watch-live.component.css']
})

export class WatchLiveComponent implements OnInit, AfterContentInit, OnDestroy {
  private appointmentId: number;//会议的appointmentId
  private sub: any;// 传递参数对象
  loginUserData = this.commonService.getLoginMsg();
  isLogin = false;
  alertMsg = false;
  isTag = true;
  // xmppPassword:any;
  // xmppServer:any;
  // xmppUsername:any;
  webrtcXmppIp: any;
  isPcVideo: boolean;
  endInterval: any;
  isPc: any;//是否pc
  browser: any;//浏览器类型
  hasFlash: any; //是否安装flash插件
  userAgentInfo: any;
  isNews = false;
  isSlide = false;

  constructor(private _activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private el: ElementRef,
              private commonService: CommonService,
              private watchLiveService: WatchLiveService,
              private authService: AuthService,
              private router: Router,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.appointmentId = params['mid'];
    });

    this.isPc = this.commonService.IsPC();
    this.browser = this.commonService.BrowserType();
    this.userAgentInfo = navigator.userAgent;

    this.isLogin = this.authService.isLoggedIn;
    // this.isLogin = this.authService.isLoggedInBool();
    if (!this.isLogin) {
      if (this.commonService.getCookie('liveId')) {
        this.commonService.deleCookie('liveId');
      }
    }
    if (this.isLogin && this.loginUserData) {
      this.XMPPConferencesData.xmppPassword = this.loginUserData.xmppPassword;
      this.XMPPConferencesData.xmppServer = this.loginUserData.xmppServer;
      this.XMPPConferencesData.xmppUsername = this.loginUserData.xmppUsername;
      this.XMPPConferencesData.webrtcXmppIp = this.webrtcXmppIp = this.loginUserData.webrtcXmppIp;
    } else {
      // this.endInterval = setInterval(() => {
        this.liveStatusFn();//未登录 定时查询直播状态
      // }, 300000);

    }

    this.playNumInterval = setInterval(() => {
      this.getPlayNumFn();
    }, 300000);
  }

  ngOnInit() {
    this.getLiveMeetingFn();//查询直播会议相关信息
    this.hasFlash = this.commonService.flashPlayer();//获取浏览器flash信息
    let LiveAddressType = this.getLiveAddressType();
    if (LiveAddressType.type == 'm3u8') {
      this.isPcVideo = false;
      this.isSlide = true;
    } else if (LiveAddressType.type == 'rtmp') {
      this.isPcVideo = true;
    }
  }

  ngAfterContentInit() {
    this.XMPPData.BOSH_SERVICE = this.webrtcXmppIp + '/http-bind/';
  }

  // 通过appointmentId查询会议信息
  liveConferenceData: any = {
    appointUser: '',
    conferenceName: '',
    conferenceDesc: '',
    startTime: '',
    playNum: 1
  };
  noConference = false;
  liveVideo = true;
  isCountDown = false; // 是否是倒计时
  liveState: any = {
    liveVideo: false,
    noConference: false,
    countDown: false,
    startTime: null
  };
  // playNum: any = 0;//播放次数
  isShowConMsg = false;//是否显示会议信息

  // 获取直播数据 判断直播状态
  getLiveMeetingFn() {
    this.watchLiveService.getLiveMeetingFn(this.appointmentId).subscribe(
      res => {
        const resultData: any = res;
        this.liveState.startTime = resultData.data.startTime;
        switch (resultData.code) {
          case 200: //正常
            this.isShowConMsg = true;
            this.liveState.liveVideo = true;
            this.liveState.countDown = false;
            this.liveConferenceData = resultData.data;
            this.checkLiveFn(resultData);
            break;
          case 33302://此会议室没有正在召开的会议
            this.liveState.noConference = true;
            break;
          case 33306://倒计时页面
            this.isShowConMsg = true;
            this.isCountDown = true;
            this.liveConferenceData = resultData.data;
            this.checkLiveFn(resultData);
            break;
          case 33310://直播结束
            // this.liveEndedFn();
            this.liveEndModal = true;
            break;
          case 30416://未开启直播
            this.noLiveFn();
            break;
        }
        this.XMPPData.ROOM_JID = resultData.data.vmrNumber + '@conference.127.0.0.1';

      },
      err => {
        console.log(err);
      });
  }


  videoObject: any;
  player: any;
  videoUrlObj: any = {
    'address': '',
    'phoneAddress': ''
  };

  //验证直播数据
  checkLiveFn(data: any) {
    this.videoUrlObj = {
      'address': data.data.address,
      'phoneAddress': data.data.phoneAddress
    };
    if (data.data.setPass && !this.commonService.getCookie('liveId')) { //是否存在直播密码 true存在，false不存在
      this.livePwdModal = true;
    } else {
      this.commonService.deleCookie('liveId');
      if (+data.code === 33306) { //倒计时
        this.startInterval(this.liveState.startTime);
      } else {
        this.liveState.countDown = false;
        setTimeout(() => {
          this.setVideoPlayer();//加载播放器
          if (this.isLogin) {
            this.loginConnect();
          }
        }, 1000);
      }
      setTimeout(() => {
        this.isSlide = false;
      }, 5000);
    }
  }

  // 根据浏览器判断 播放视频流类型
  getLiveAddressType() {
    const returnObj = {
      'type': '',
      'address': ''
    };
    if (this.isPc) {//是否pc true是 false否
      if (this.browser == 'FF' || this.browser == 'Chrome') {//Chrome,FF
        returnObj.type = 'rtmp';
        returnObj.address = this.videoUrlObj.address;
      } else if (this.browser == 'Safari') {//Safari
        returnObj.type = 'm3u8';
        returnObj.address = this.videoUrlObj.phoneAddress;
      } else {
        returnObj.type = 'rtmp';
        returnObj.address = this.videoUrlObj.address;
      }
    } else {
      returnObj.type = 'm3u8';
      returnObj.address = this.videoUrlObj.phoneAddress;
    }
    return returnObj;
  }

  //加载播放器
  LiveAddressTypes: any = {
    'type': '',
    'address': ''
  };

  setVideoPlayer() {
    if (this.liveConferenceData.isKeep == false) {
      this.noKeepFn();
      return false;
    }
    this.LiveAddressTypes = this.getLiveAddressType();
    this.videoObject = {
      container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
      variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
      autoplay: true,//自动播放
      // html5m3u8:true,
      live: true,//直播视频形式
      video: this.LiveAddressTypes.address //'rtmp://live.hkstv.hk.lxdns.com/live/hks', //视频地址(rtmp协议/m3u8协议)
    };
    this.player = new ckplayer(this.videoObject);

  }


  // plays(){
  //   this.el.nativeElement.querySelector("#video1").play();

  // }
  //验证输入的直播密码
  livePwdModal = false;
  livePwd: any = '';

  checkLivePwdFn() {
    if (!this.livePwd) {
      this._notification.create('error', '请输入直播密码', '');
      return false;
    }
    const postData = {'livePwd': this.livePwd};
    this.watchLiveService.checkLivePwdFn(this.appointmentId, postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.livePwdModal = false;
          if (this.isLogin) {
            this.loginConnect();
            setTimeout(() => {
              this.isSlide = false;
            }, 5000);
          }
          if (this.isCountDown) {
            this.startInterval(this.liveState.startTime);
          } else {
            this.setVideoPlayer();
          }
        } else {
          this._notification.create('error', resultData.msg, '');
        }
      },
      err => {
        this.livePwdModal = false;
      });
  }

  //直播结束 弹框
  liveEndedFn() {
    this.liveEndModal = false;
    if (this.endInterval) {
      clearInterval(this.endInterval);
    }
    window.close();
  }

  // 直播未开启
  noLiveFn() {
    this.confirmServ.confirm({
      title: '提示',
      content: '当前未开启直播!',
      okText: '确定',
      // cancelText: '取消',
      onOk: async () => {
        // await this.sureDeleteMeetingFn(deleteArr);
      },
      onCancel() {
      }
    });
  }


  //暂无参会者入会
  noKeepFn() {
    this.confirmServ.confirm({
      title: '提示',
      content: '暂无参会者入会!',
      okText: '确定',
      // cancelText: '取消',
      onOk: async () => {
        // await this.sureDeleteMeetingFn(deleteArr);
      },
      onCancel() {
      }
    });
  }


  // 直播未开始 倒计时
  //date(毫秒)
  getCountdown(date: any) {
    var obj = {};
    var current_date = new Date().getTime();
    var seconds_left = (date - current_date) / 1000;

    var days = this.pad(parseInt('' + seconds_left / 86400));
    seconds_left = seconds_left % 86400;

    var hours = this.pad(parseInt('' + seconds_left / 3600));
    seconds_left = seconds_left % 3600;

    var minutes = this.pad(parseInt('' + seconds_left / 60));
    var seconds = this.pad(parseInt('' + seconds_left % 60));
    obj = {
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
    return obj;
  }

  pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  downTimer: any;
  ouptCountDown: any = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  startInterval(startTime: any) {
    this.liveState.countDown = true;
    this.downTimer = setInterval(() => {
      if (startTime <= new Date().getTime()) {
        this.liveState.liveVideo = true;
        this.liveState.countDown = false;
        setTimeout(() => {
          this.setVideoPlayer();
          if (this.isLogin) {
            this.loginConnect();
          }
        }, 100);
        clearInterval(this.downTimer);
      }
      this.ouptCountDown = this.getCountdown(startTime);
    }, 1000);
  }

  /***  分享  ***/
  shareAddress: string;
  shareLiveModal = false;
  liveQrImg: any;

  shareFn() {
    // this.shareAddress = this.commonService.getPath() + '?url=watch-live/' + this.appointmentId;
    this.shareAddress = this.commonService.getPath() + '#/watch-live/'+this.appointmentId;
    this.liveQrImg = environment.apiBase + '/uc/lives/' + this.appointmentId + '/code';//会议二维码图片初始化
    this.shareLiveModal = true;
  }

  //复制链接
  toClipboardLive() {
    this.shareLiveModal = false;
    this._notification.create('success', '复制成功', '');
  }

  //分享给qq好友
  shareToqqFriend(title, url, picurl) {
    const shareqqstring = 'http://connect.qq.com/widget/shareqq/index.html?title=' + title + '&url=' + encodeURIComponent(url) + '&pics=' + encodeURIComponent(picurl);
    window.open(shareqqstring, 'newwindow', 'height=800,width=800,top=100,left=100');
  }


  //分享至
  showWeChatImg = false;

  shareToFn(type: any) {
    const address = this.shareAddress;
    if (type == 'weixin') {
      this.showWeChatImg = true;
      this.shareLiveModal = false;
    } else if (type == 'qq') {
      this.shareToqqFriend(
        '会议直播',
        address,
        this.commonService.getPath() + 'assets/img/live_share.jpg'
      );
    }
  }

  /********* 直播聊天 *********/
  messageContent: any = [];

  /**************** xmpp连接 开始 ****************/
  XMPPConferencesData: any = {
    xmppUsername: '',
    xmppPassword: '',
    webrtcXmppIp: '',
    xmppServer: ''
  };
  XMPPData: any = {
    reConnectFlag: false,
    // XMPP服务器BOSH地址
    BOSH_SERVICE: '',//this.loginUserData.webrtcXmppIp + '/http-bind/'
    // 房间JID 1085911
    ROOM_JID: '',
    // XMPP连接
    connection: null,
    // 当前状态是否连接
    connected: false,
    // 当前登录的JID
    jid: ''
  };
  // i:any = 0;
  // reConnectFlag = false;
  //是否是被别人踢掉的
  isKicked = false;
  timer: any = null;

  // 连接状态改变的事件
  onConnect = (status) => {
    if (status == Strophe.Status.AUTHFAIL) {
      console.log(`${status}=>`, '登录失败！');
    } else if (status == Strophe.Status.CONNTIMEOUT) {
      console.log(`${status}=>`, '连接超时！');
    } else if (status == Strophe.Status.CONNFAIL) {
      console.log(`${status}=>`, '连接失败！');
    } else if (status == Strophe.Status.AUTHFAIL) {
      console.log(`${status}=>`, '登录失败！');
    } else if (status == Strophe.Status.DISCONNECTING) {
      console.log(`${status}=>`, '连接正在关闭！');
      this.XMPPData.connected = false;
    } else if (status == Strophe.Status.ERROR) {
      console.log(`${status}=>`, '连接错误！');
      this.XMPPData.connected = false;
    } else if (status == Strophe.Status.DISCONNECTED) {
      console.log(`${status}=>`, '连接断开！');
      this.XMPPData.connected = false;
      // this.i == 0 &&
      if (!this.isKicked) {
        this.reConnect();
      }
      // this.i++;
    } else if (status == Strophe.Status.CONNECTING) {
      console.log(`${status}=>`, '正在连接！');
      this.XMPPData.connected = false;
    } else if (status == Strophe.Status.CONNECTED) {
      console.log(`${status}=>`, '连接成功，可以开始聊天了！');
      // console.log('before', this.XMPPData);
      this.XMPPData.connected = true;
      // 当接收到<message>节，调用onMessage回调函数
      this.XMPPData.connection.addHandler(this.onMessageFn, null, 'message', null, null, null);
      if (this.XMPPData.reConnectFlag) {
        setTimeout(() => {
          this.XMPPData.connection.addHandler(this.onStream, null, 'stream:error', null, null, null);
        }, 60000);
      } else {
        this.XMPPData.connection.addHandler(this.onStream, null, 'stream:error', null, null, null);
      }

      // 首先要发送一个<presence>给服务器（initial presence）
      // this.XMPPData.connection.send($pres().tree());
      this.XMPPData.connection.sendPresence($pres().tree());

      // 发送<presence>元素，加入房间
      // var pres = $pres({
      //     from: this.XMPPData.jid,
      //     to: this.XMPPData.ROOM_JID,
      // }).c('x',{xmlns: 'http://jabber.org/protocol/muc'}).tree();
      // this.XMPPData.connection.sendPresence($pres);
      this.XMPPData.connection.send($pres({
        from: this.XMPPData.jid,
        to: this.XMPPData.ROOM_JID + '/' + this.XMPPData.jid.substring(0, this.XMPPData.jid.indexOf('@'))
      }).c('x', {xmlns: 'jabber:client'}).tree());

      // 发送在线状态
      this.XMPPData.connection.sendPresence($pres({
        from: this.XMPPData.jid,
      }).c('status', '2').tree());
      this.XMPPData.connection.send($pres().c('priority').t('1'));
      // this.XMPPData.connection.sendIQ(pres);//获取房间列表
      // console.log('after', this.XMPPData);
    }
  };

  onStream = (msg) => {
    console.log('xmpp isKicked', msg);
    this.isKicked = true;
  };

  // 接收到<message>
  onMessageFn = (msg) => {
    console.log(msg);
    // 解析出<message>的from、type属性，以及body子元素
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var body = elems[0];
    var elemsSubject = msg.getElementsByTagName('subject');
    if (type == 'groupchat' && elems.length > 0) {
      var subject = elemsSubject[0];
      if (elemsSubject.length > 0) {
        var subjectArr = subject.innerHTML.split('|');
        var userData = from.substring(from.indexOf('/') + 1);
        var userArr = userData.split('-');
        var content = JSON.parse(body.innerHTML);
        var chatMsgObj = {
          'userId': userArr[0],
          'realName': userArr[1],
          'msgType': subjectArr[0],
          'roomType': subjectArr[1],
          'content': content.msgData
        };
        chatMsgObj['colors'] = 'avatar-color' + Math.ceil(parseInt(userArr[0]) % 10 / 2);
        if (subjectArr[0] == '5000') {
          this.messageContent.push(chatMsgObj);
          setTimeout(function () {
            var _el = document.getElementById('chart-list');
            _el.scrollTop = _el.scrollHeight;
          }, '100');
          this.checkMsgType(chatMsgObj);
        }
      }
      var bodyObj = JSON.parse(body.innerHTML);
      if (bodyObj.msgType == 3032) {
        this.liveEndModal = true;
        // this.liveEndedFn();
      }
    } else if (type == 'chat') {
      var bodyChatObj = JSON.parse(body.innerHTML);
      if (bodyChatObj.msgType == 3033) {//uc已退出登录
        if (this.isLogin) { //已登陆的用户才会收到
          this.disConnectXmpp();//断开xmpp
          this.isLogin = false;//设置登录状态为false
          // this.endInterval = setInterval(() => {// 定时查询直播是否结束
            this.liveStatusFn();//未登录 定时查询直播状态
          // }, 300000);
        }
      }
    }

    return true;
  };

  alertMsgContent: any;
  alertMsgTip: any;
  alertTime: any;


  //判断是否为@消息
  checkMsgType(msg: any) {
    var isHaveAt = this.checkIsAlertMsg(msg);
    if (isHaveAt) {
      this.alertMsgTip = true;
      this.alertMsgContent = msg;
      setTimeout(() => {
        this.alertMsgTip = false;
      }, 5000);
    }
  }

  checkIsAlertMsg(msg: any) {
    //判断msg.content是否存在@提示符
    let msgstr = '@' + this.loginUserData.realName;
    return msg.content.indexOf(msgstr) > -1;

  }

  //发送消息
  sendMessage = (data, subject) => {
    if (this.XMPPData.connected) {
      var sendMsg = data;
      // 创建一个<message>元素并发送
      var msg = $msg({
        to: this.XMPPData.ROOM_JID,
        from: this.XMPPData.jid,
        type: 'groupchat'
      }).c('body', null, sendMsg).c('subject', null, subject);
      this.XMPPData.connection.send(msg.tree());
    } else {
      console.log('请先登录！');
    }
  };
  //重连
  reConnect = () => {
    this.XMPPData.reConnectFlag = true;
    this.timer = setInterval(() => {
      if (!this.XMPPData.connected) {
        this.loginConnect();
        if (this.XMPPData.connected) {
          console.log('重连成功');
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
      }
    }, 15000);
  };

  // 通过BOSH连接XMPP服务器
  loginConnect = () => {
    if (!this.XMPPData.connected) {
      this.XMPPData.connection = new Strophe.Connection(this.XMPPData.BOSH_SERVICE);
      this.XMPPData.connection.connect(this.XMPPConferencesData.xmppUsername + '@' + this.XMPPConferencesData.xmppServer + '/live', this.XMPPConferencesData.xmppPassword, this.onConnect);
      // this.XMPPData.jid = this.XMPPConferencesData.xmppUsername+"-"+this.loginUserData.realName + '@' + this.XMPPConferencesData.xmppServer;
      this.XMPPData.jid = this.XMPPConferencesData.xmppUsername + '-' + this.loginUserData.realName + '@' + this.XMPPConferencesData.xmppServer;

    } else {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  // 断开xmpp连接
  disConnectXmpp = () => {
    // this.isKicked = true;
    if (this.XMPPData.connected) {
      this.XMPPData.connection.disconnect();
    }
  };


  /******************* xmpp连接 结束 ****************/
  sendMsgCont: string;//发送框输入内容
  keyDownSendMsgFn = (data) => {
    var datat = {'msgData': data};
    if (this.isLogin) {
      if (data) {
        this.sendMessage(JSON.stringify(datat), '5000|1');
        this.sendMsgCont = '';//输入框设为空
      }
    } else {
      // alert("请先登录")
      // this._notification.create('error', '请先登录','');
      if (this.isPcVideo) {
        this.confirmServ.confirm({
          title: '提示',
          content: '请先登录，登录后才可以聊天!',
          okText: '登录',
          cancelText: '取消',
          onOk: async () => {
            this.commonService.setCookie('fromWeb', 'live');
            this.commonService.setCookie('liveId', this.appointmentId);
            this.router.navigate(['/login']);
          },
          onCancel() {
          }
        });
      } else {
        this.isNews = true;
      }
    }

  };

  loginBtn() {
    this.commonService.setCookie('fromWeb', 'live');
    this.commonService.setCookie('liveId', this.appointmentId);
    this.router.navigate(['/login']);
  }


  //未登录请求查询直播是否结束
  liveEndModal = false;

  liveStatusFn() {
    this.http.get('/uc/conferences/' + this.appointmentId + '/live-status').subscribe(
      res => {
        let resultData: any = res;
        if (resultData.code == 200 && resultData.data) {
          // 直播结束
          this.liveEndModal = true;
          // this.liveEndedFn();
          if (this.endInterval) {
            clearInterval(this.endInterval);
          }
        }
      },
      err => {
        // this.livePwdModal = false;
      });
  }


  playNumInterval: any;//查询观看人数 定时器
  //获取观看人数
  getPlayNumFn() {
    this.watchLiveService.getPlayNumFn(this.appointmentId).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200 || +resultData.code === 33306) {
          this.liveConferenceData.playNum = resultData.data.playNum;
        }
      },
      err => {
        // this.livePwdModal = false;
      });
  }


  //组件卸载的时候取消订阅
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.isKicked = true;
    this.disConnectXmpp();
    if (this.downTimer) {
      clearInterval(this.downTimer);
    }
    if (this.endInterval) {
      clearInterval(this.endInterval);
    }
    if (this.playNumInterval) {
      clearInterval(this.playNumInterval);
    }
  }
}
