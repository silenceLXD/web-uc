import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {EventBusService} from '@services/event-bus.service';
import {AuthService} from '@services/auth.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {CustomizeVService} from '../customize-v.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.css']
})
export class CustomizeComponent implements OnInit {

  // 是否可用
  isAvailableOne: boolean;
  entData: any = {
    entDomainName: '',   //
    entShowName: '',  //显示名称
    entDomain: '',    //绑定域名
    logoUrl: '',  //  企业logo
    slogan: ''  //企业标语
  };
  isActive: number = 1;  // 1 为企业模板 2 为企业配置
  istpl: number = 0; // 企业模板 0 为默认颜色，
  previewImageLogo: any; //上传的logo
  logoId: number = 0; //上传的logo的ID

  public loginUserData = this.commonService.getLoginMsg();
  entId: any = this.loginUserData.entId;
  userId: any = this.loginUserData.userId;
  colorTemplate: any = ['navbarHeaderBlack', 'navbarHeaderTechBlur', 'navbarHeaderBlur', 'navbarHeaderDark', 'navbarHeaderGreen'];

  constructor(private router: Router,
              private fb: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private domSanitizer: DomSanitizer,
              private customizeVService: CustomizeVService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService,
              private authService: AuthService,
              private _eventBus: EventBusService) {
  }

  @ViewChild('imgHidden') imgHidden: ElementRef;

  ngOnInit() {
    this.isAvailableOne = this.commonService.getAvailableThree();
    this.getCustomizeEntList();  // 通过企业ID查询企业订制信息
  }

  showLogo: string;
  isShowLogo: number;

  /* 通过企业ID查询企业订制信息 */
  getCustomizeEntList() {
    if (this.entId == 'undefined') {
      this.entId = 0;
    }
    this.customizeVService.getCustomizeEntList(this.entId).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.istpl = datalist.data.ent.templateType;
          this.entData.entDomainName = datalist.data.entDomainName;
          this.entData.entShowName = datalist.data.ent.entShowName;
          this.entData.entDomain = datalist.data.ent.entDomain;
          this.entData.logoUrl = datalist.data.ent.logoUrl;
          this.entData.slogan = datalist.data.ent.slogan;
          this.entData.logoId = datalist.data.ent.logoId;
          this.isShowLogo = this.entData.logoId;
          this.showLogo = environment.apiBase + '/uc/ents/logo/logoUrl?logoUrl=' + this.entData.logoId;
          this._eventBus.templateType.emit(this.colorTemplate[datalist.data.ent.templateType]);
          this._eventBus.entShowName.emit(datalist.data.ent.entShowName);
          this._eventBus.slogan.emit(datalist.data.ent.slogan);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 选择企业模板 */

  chooseTplFn(value: any) {
    this.istpl = value;
    this._eventBus.templateType.emit(this.colorTemplate[value]);
  }

  /* 修改企业模板 */
  applyTemplateFn() {
    if (this.entId == '') {
      this.entId = 0;
    }
    if (!this.istpl) {
      this.istpl = 0;
    }
    this.customizeVService.applyTemplateFn(this.entId, this.istpl).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this._notification.create('success', '应用成功', '');
        } else {
          this._notification.create('error', '应用失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 企业配置 企业模板切换 */
  changeTab(value: any) {
    this.isActive = value;
  }

  /* 选择的logo */
  imgUrlName: any;
  noUpImg: boolean = false;
  isImg: any;

  previewImage(value: any) {
    const imgSize = (value.target.files[0].size / 1024).toFixed(0);
    if (parseInt(imgSize, 10) > 200) {
      this._notification.create('error', '文件大小不能超过200K请重新上传', '');
      this.noUpImg = true;
      return false;
    } else {
      this.noUpImg = false;
      const reader = new FileReader();
      reader.onload = function (evt) {
      };
      this.isImg = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(value.target.files[0]));
      this.imgUrlName = value.target.files[0].name;
      this.previewImageLogo = value.target.files[0];
    }
  }

  /* 检测 域名 */
  checkDomain() {
    if (this.entData.entDomain) {
      // let url = '/' + this.entData.entDomain + '/uc/ents/testIP';
      this.customizeVService.checkDomain(this.entData.entDomain).subscribe(
        res => {
          const datalist: any = res;
          if (+datalist.code === 200) {

          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  /* 保存 企业配置 */
  updateConfigFn() {
    if (('undefined' != typeof (this.previewImageLogo)) || (null != this.previewImageLogo)) {
      this.entData.logoUrl = this.previewImageLogo.name;
      const formData = new FormData();
      formData.append('upFile', this.previewImageLogo);
      // 上传企业logo文件
      if (!this.noUpImg) {
        if (+this.imgHidden.nativeElement.width === 80 && +this.imgHidden.nativeElement.height === 40) {
          this.customizeVService.updateConfigFn(formData).subscribe(
            res => {
              const datalist: any = res;
              if (+datalist.code === 200) {
                this.logoId = datalist.data;
                this.imgUrlName = '';
                this.updateCollocate();
              } else {
                this._notification.create('error', '上传文件格式不正确', '');
              }
            },
            err => {
              console.log(err);
            });
        } else {
          this._notification.create('error', '图片尺寸有误,请重新上传', '');
        }
      } else {
        this._notification.create('error', '文件大小不能超过200K请重新上传', '');
      }
    } else {
      this.entData.logoUrl = '';
      this.updateCollocate();
    }

  }

  /* 保存企业个性化地址 */
  updateCollocate() {
    const getData = {
      showName: this.entData.entShowName,
      domain: this.entData.entDomain,
      slogan: this.entData.slogan,
      url: this.logoId + ''
    };
    this.customizeVService.updateCollocate(getData).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this._notification.create('success', '保存成功', '');
          this.getCustomizeEntList();
          this.getEntUserInfo();
        } else {
          this._notification.create('error', '保存失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 根据企业ID获取企业信息 */
  getEntUserInfo() {
    this.customizeVService.getEntUserInfo(this.entId).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          if (datalist.data.logoUrl) {
            this._eventBus.logURL.emit(environment.apiBase + '/uc/ents/logo/logoUrl?logoUrl=' + datalist.data.logoUrl);
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
