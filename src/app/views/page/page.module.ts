import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
// ngx-echarts
import {NgxEchartsModule} from 'ngx-echarts';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NZ_NOTIFICATION_CONFIG} from 'ng-zorro-antd';

// ngx-bootstrap
import {AlertModule, PaginationModule, ModalModule, TabsModule} from 'ngx-bootstrap';
// 公共组件
import {LayoutModule} from '../layout/layout.module';
// 路由
import {PageRoutesModule} from './page.routes';

// 自定义管道pipe
import {AllPipesModule} from '@pipes/all-pipes.module';

// 主入口组件
import {PageComponent} from './page.component';
// homePage
import {HomePageComponent} from '../homePage/home-page.component';
import {AdminHomeComponent} from '../homePage/admin-home/admin-home.component';
import {UserHomeComponent} from '../homePage/user-home/user-home.component';
import {PersonalHomeComponent} from '../homePage/personal-home/personal-home.component';

// personal-center（个人中心）
import {PersonalCenterComponent} from '../setting/personal-center/personal-center.component';
// change-admin(更换管理员)
import {ChangeAdminComponent} from '../setting/change-admin/change-admin.component';
// create-ent（创建企业）
import {CreateEntComponent} from '../setting/create-ent/create-ent.component';
// 无权限
import {NoJurisdictionComponent} from '../setting/no-jurisdiction/no-jurisdiction.component';
// 自定义组件
import {AttendTreeComponent} from '../meeting/add-attend/attend-tree.component';
import {TreeviewModule} from '../plugins/treelib/treeview.module';
import {MeetingControlBtnModule} from '../layout/meeting-control-btn.module';
import {PageService} from './page.service';
import {AdminHomeService} from '../homePage/admin-home/admin-home.service';
import {UserHomeService} from '../homePage/user-home/user-home.service';
import {PersonalHomeService} from '../homePage/personal-home/personal-home.service';
import {PersonalCenterService} from '../setting/personal-center/personal-center.service';
import {ChangeAdminService} from '../setting/change-admin/change-admin.service';
import {CreateEntService} from '../setting/create-ent/create-ent.service';
import {LoadingComponent} from "../setting/loading/loading.component";


// export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
//    let service = new HttpInterceptorService(xhrBackend, requestOptions);
//    return service;
//  }

@NgModule({
  declarations: [
    PageComponent,
    HomePageComponent,
    AdminHomeComponent,
    UserHomeComponent,
    PersonalHomeComponent,
    PersonalCenterComponent,
    ChangeAdminComponent,
    CreateEntComponent,
    NoJurisdictionComponent,
    // 自定义组件
    AttendTreeComponent,
    LoadingComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    MeetingControlBtnModule,
    ReactiveFormsModule,
    PageRoutesModule, // 路由
    LayoutModule,
    AllPipesModule, // 管道
    NgxEchartsModule,
    ClipboardModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot(),
    TreeviewModule,
  ],
  providers: [
    // { provide: TokenService, useClass: TokenService },
    {
      provide: NZ_NOTIFICATION_CONFIG,
      useValue: {nzTop: '70px'}
    },
    // { provide: NZ_MESSAGE_CONFIG, useValue: { nzTop: '70px' } }
    PageService,
    AdminHomeService,
    UserHomeService,
    PersonalHomeService,
    PersonalCenterService,
    ChangeAdminService,
    CreateEntService,
  ],
})
export class PageModule {
}
