import {Component, OnInit, Input} from '@angular/core';
// import { HttpInterceptorService } from '@services/HttpUtils.Service';
// import { Http } from "@angular/http";
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {SidebarService} from '../sidebar.service';
import {EventBusService} from '@services/event-bus.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  bgColor: any = 'navbarHeaderBlack';

  /* 初始化数据 */
  // switchflag(个人和企业控制台的切换)0：企业控制的菜单，1：个人控制台
  // 角色类型roleType  1：一级管理员  2：二级管理员  3：企业用户  8：个人用户
  switchflag: number;

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private sidebarService: SidebarService,
              private _eventBus: EventBusService) {
    _eventBus.changeFlag.subscribe((value: number) => {
      this.switchflag = value;
      this.getMenuFn(this.switchflag);
    });
    _eventBus.templateType.subscribe((value: string) => {
      if (value) {
        this.bgColor = value;
      }
    });
  }


  public loginUserData = this.commonService.getLoginMsg();

  sidebarData: any;
  entId: any = this.loginUserData.entId;
  roleType = this.loginUserData.roleType;

  ngOnInit() {
    // this.getCurrentThemeColor();
  }

  // 获取菜单
  getMenuFn(flag) {
    // if(this.switchflag == 0){
    //   this.sidebarData = this.adminSidebarData;
    // }else{
    //   this.sidebarData = this.userSidebarData;
    // }
    this.sidebarService.getMenuFn(flag).subscribe(
      res => {
        // console.log(res);//打印返回的数据
        const resData: any = res;
        this.sidebarData = resData.data.map((item) => {
          if (item.parentId && +item.parentId === 16 && item.resUrl !== 'noJurisdiction') {
            item.prefixUrl = 'consumption/';
            return item;
          } else if (item.parentId && (+item.parentId === 19 || +item.parentId === 29) && item.resUrl !== 'noJurisdiction') {
            item.prefixUrl = 'contacts/';
            return item;
          } else if (item.parentId && (+item.parentId === 1 || +item.parentId === 10) && item.resUrl !== 'noJurisdiction') {
            item.prefixUrl = 'meeting/';
            return item;
          } else if (item.parentId && +item.parentId === 5 && item.resUrl !== 'noJurisdiction') {
            item.prefixUrl = 'my-meeting/';
            return item;
          } else {
            item.prefixUrl = '';
            return item;
          }
        });
        // console.log(this.sidebarData);
      },
      err => {
        console.log(err);
      }
    );

  }

  // 重新定向到原路由
  redirectTo(uri: string, minUrl, index?: number) {
    this.commonService.redirectTo(uri, minUrl, index);
  }
}
