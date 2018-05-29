import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {CommonService} from '@services/common.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {SettingService} from '@services/setting.service';
import {EventBusService} from '@services/event-bus.service';
import {HeaderService} from '../header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public loginUserData = this.commonService.getLoginMsg();
  nickName = this.commonService.decodeUTF8(this.commonService.getCookie('nickName'));
  // public loginUserData = JSON.parse(localStorage.getItem('uc_loginData'));
  settingData: any;
  entId: any = this.loginUserData.entId;
  roleType: any = this.loginUserData.roleType;

  bgColor: any = 'navbarHeaderBlack';
  entShowName: any = ''; // 企業名
  slogan: any = '';   // 企業標語
  logURL: any = 'assets/img/logo_white.png';
  dataBaseType: any;
  switchflag: number;
  headerActive: any;

  msgUnreadCount: any; // 未读消息数
  // 获取消息总数和未读总数
  msgCountSearch: any = { // 查询条件数据
    isReadActivityMessage: '', // 是否读取群发消息（1是 管理员,0否 用户）
    isRead: '',
    createTime: '' // 登录人创建时间
  };

  unTemplateType: any;
  unEntShowName: any;
  unSlogan: any;
  unLogURL: any;
  @Output() emitAccountStatus: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router,
              private commonService: CommonService,
              private headerService: HeaderService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService,
              private settingService: SettingService,
              private _eventBus: EventBusService) {
    // this._eventBus.changeFlag.emit(this.switchflag);
    this.unTemplateType = _eventBus.templateType.subscribe((value: string) => {
      if (value) {
        this.bgColor = value;
      }
    });
    this.unEntShowName = _eventBus.entShowName.subscribe((value: string) => {
      this.entShowName = value;
    });
    this.unSlogan = _eventBus.slogan.subscribe((value: string) => {
      this.slogan = value;
    });
    this.unLogURL = _eventBus.logURL.subscribe((value: string) => {
      this.logURL = value;
    });
  }

  // 入会设置数据
  setting: any = {
    nonEnt: false,
    nonRegistered: false,
  };

  ngOnInit() {
    // this.getCurrentThemeColor();
    if (this.loginUserData.roleType == 1 || this.loginUserData.roleType == 2) {
      this.switchflag = 0;
    } else {
      this.switchflag = 1;
    }

    this._eventBus.changeFlag.emit(this.switchflag);

    this.settingData = this.settingService.getVcsSetting();
    // this.bgColor = this.settingData.VCS_THEME_COLOR;

    // this.roleType = this.loginUserData.roleType;
    // this.getCurrentThemeColor();
    this.getEntDataFn();
    this._eventBus.editRealNameFn.subscribe(value => {
      this.loginUserData.realName = value;
    });
    this._eventBus.msgCountFn.subscribe(value => {
      this.msgUnreadCount = value;
    });
    // this.getMsgCount();
      this.headerActive = localStorage.getItem('switchflag')
  }

  ngOnDestroy() {
    this.unTemplateType.unsubscribe();
    this.unEntShowName.unsubscribe();
    this.unSlogan.unsubscribe();
    this.unLogURL.unsubscribe();
  }

  // 获取消息总数和已读数
  getMsgCount() {
    this.msgCountSearch.isReadActivityMessage = this.roleType;
    if (+this.msgCountSearch.isReadActivityMessage === 1) {
      this.msgCountSearch.createTime = localStorage.accountcreateTime;
    } else {
      this.msgCountSearch.createTime = '0';
    }
    // const getData = this.commonService.formObject(this.msgCountSearch);
    this.headerService.getMsgCount(this.msgCountSearch).subscribe(
      res => {
        const resultData: any = res;
        this.msgUnreadCount = resultData.data.allCount - resultData.data.readCount;
      },
      err => {
        console.log(err);
      });
  }

  // 根据企业ID查询企业信息
  isShowProduct = false;
  entData: any = {
    entName: ''
  };

  getEntDataFn() {
    if (this.entId != undefined) {
      this.headerService.getEntDataFn(this.entId).subscribe(
        res => {
          const datalist: any = res;
          if (+datalist.code === 200) {
            localStorage.accountStatus = datalist.data.accountState;
            localStorage.accountcreateTime = datalist.data.createTime;
            // this.commonService.getLoginMsg().roleType;
            localStorage.accountcreateTime = datalist.data.createTime;
            this.getMsgCount();
            if (+localStorage.accountStatus === 4 && +this.commonService.getLoginMsg().roleType === 3) {
              this.emitAccountStatus.emit();
            }
            this.isShowProduct = datalist.data.isShow;
            this.entData = datalist.data;
            if (datalist.data.logoUrl) {
              this._eventBus.logURL.emit(environment.apiBase + '/uc/ents/logo/logoUrl?logoUrl=' + datalist.data.logoUrl);
            } else {
              this._eventBus.logURL.emit('assets/img/logo_white.png');
            }
            // 获取入会设置状态 发射
            localStorage.conferenceSetting = datalist.data.conferenceSetting;
            if (datalist.data.conferenceSetting == 0) {
              this.setting.nonEnt = false;
              this.setting.nonRegistered = false;
            } else if (datalist.data.conferenceSetting == 1) {
              this.setting.nonEnt = true;
              this.setting.nonRegistered = false;
            } else if (datalist.data.conferenceSetting == 2) {
              this.setting.nonEnt = false;
              this.setting.nonRegistered = true;
            } else if (datalist.data.conferenceSetting == 3) {
              this.setting.nonEnt = true;
              this.setting.nonRegistered = true;
            }
          }
        },
        err => {
          console.log(err);
        });
    }

  }

  /************** 切换控制台 ************/
  changeFlagFn(type:any) {
    this.switchflag = type;
    localStorage.setItem('switchflag', type);
    // if (this.switchflag == 0) {
    //   this.switchflag = type;
    //   localStorage.setItem('switchflag', '1');
    // } else {
    //   this.switchflag = type;
    //   localStorage.setItem('switchflag', '0');
    // }
    this._eventBus.changeFlag.emit(type);
  }

  /************** 总览页 ************/
  //查看当前身份的
  overviewFn() {
    this._eventBus.changeFlag.emit(this.switchflag);
    this.redirectTo('/page/home-page', '/111');
  }

  // 重新定向到原路由
  redirectTo(uri: string, minUrl, index?: number) {
    this.commonService.redirectTo(uri, minUrl, index);
  }

  /************** 入会设置 ************/
  meetingSettingModal = false;

  meetingSettingFn() {
    this.meetingSettingModal = true;
  }

  //确定入会设置
  sureSettingFn() {
    let type: any;
    if (this.setting.nonEnt && this.setting.nonRegistered) {
      type = 3;
    } else if (this.setting.nonEnt) {
      type = 1;
    } else if (this.setting.nonRegistered) {
      type = 2;
    } else if (!this.setting.nonEnt && !this.setting.nonRegistered) {
      type = 0;
    }
    const getData = {
      'conferenceSetting': type
    };
    return this.headerService.renewalsOrderFn(this.entId, getData).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.meetingSettingModal = false;
          this._eventBus.conferenceSetting.emit(type);
          localStorage.conferenceSetting = type;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /************** 退出登录 ************/
    // logoutModal: boolean = false;
  logoutFn = () => {
    this.confirmServ.confirm({
      title: '退出',
      content: '是否确认退出登录！',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.sureLogoutFn();
      },
      onCancel() {
      }
    });
  };

  // 确定退出登录logout
  sureLogoutFn() {
    this.headerService.sureLogoutFn().subscribe(
      res => {
        const resData: any = res;
        if (+resData.code === 200) {
          this.commonService.deletAllLoginData();//清除cookies，localStorage，并返回登录
        }
      },
      err => {
        console.log(err);
      });
  }
}
