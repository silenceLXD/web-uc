import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PageComponent} from './page.component';
// homePage
import {HomePageComponent} from '../homePage/home-page.component';
// personal-center（个人中心）
import {PersonalCenterComponent} from '../setting/personal-center/personal-center.component';
// change-admin(更换管理员)
import {ChangeAdminComponent} from '../setting/change-admin/change-admin.component';
// create-ent（创建企业）
import {CreateEntComponent} from '../setting/create-ent/create-ent.component';
// 无权限
import {NoJurisdictionComponent} from '../setting/no-jurisdiction/no-jurisdiction.component';
import {LoadingComponent} from '../setting/loading/loading.component';

const pageRoutes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {path: '', redirectTo: 'home-page', pathMatch: 'full'},
      {path: 'home-page', component: HomePageComponent},
      {path: 'loading', component: LoadingComponent},

      {path: 'product', loadChildren: '../product/product.module#ProductModule'},

      {path: 'meeting', loadChildren: '../meeting/meeting.module#MeetingModule'},

      {path: 'my-meeting', loadChildren: '../myMeeting/my-meeting.module#MyMeetingModule'},

      {path: 'consumption', loadChildren: '../consumption/consumption.module#ConsumptionModule'},

      {path: 'contacts', loadChildren: '../contacts/contacts.module#ContactsModule'},

      {path: 'message', loadChildren: '../message/message.module#MessageModule'},

      {path: 'personal-center', component: PersonalCenterComponent},
      {path: 'change-admin', component: ChangeAdminComponent},
      {path: 'create-ent', component: CreateEntComponent},

      {path: 'noJurisdiction', component: NoJurisdictionComponent},
    ]
  }
  // { path:'login', component: LoginComponent},
  // { path:'**', component:HomePageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PageRoutesModule {
}
