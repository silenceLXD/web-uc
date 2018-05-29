import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {EntBookComponent} from './ent-book/ent-book.component';
import {EntContactsComponent} from './ent-contacts/ent-contacts.component';
import {EntGroupComponent} from './ent-group/ent-group.component';
import {EntRealroomComponent} from './ent-realroom/ent-realroom.component';
import {UserContactsComponent} from './user-contacts/user-contacts.component';
import {UserGroupComponent} from './user-group/user-group.component';
import {ContactsRoutesModule} from './contacts.routes';
import {ContactsTreeComponent} from './contacts-tree.component';
import {EntVideoComponent} from './ent-video/ent-video.component';
import {OrderListComponent} from './order/order-list/order-list.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import {PayinfoComponent} from './order/payinfo/payinfo.component';
import {OperationLogComponent} from './operation-log/operation-log.component';
import {CustomizeComponent} from './customize/customize.component';
import {WrapComponent} from '../plugins/wrap/wrap.component';
import {CustomizeVService} from './customize-v.service';
import {EntBookService} from './ent-book.service';
import {EntContactsService} from './ent-contacts.service';
import {EntGroupService} from './ent-group.service';
import {EntRealroomService} from './ent-realroom.service';
import {EntVideoService} from './ent-video.service';
import {OperationLogService} from './operation-log.service';
import {OrderDetailService} from './order-detail.service';
import {OrderListService} from './order-list.service';
import {PayinfoService} from './payinfo.service';
import {UserContactsService} from './user-contacts.service';
import {UserGroupService} from './user-group.service';

@NgModule({
  imports: [
    ContactsRoutesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    EntBookComponent,
    EntContactsComponent,
    EntGroupComponent,
    EntRealroomComponent,
    UserContactsComponent,
    UserGroupComponent,
    EntVideoComponent,
    OrderListComponent,
    OrderDetailComponent,
    PayinfoComponent,
    OperationLogComponent,
    CustomizeComponent,
    ContactsTreeComponent,
    WrapComponent
  ],
  providers: [
    CustomizeVService,
    EntBookService,
    EntContactsService,
    EntGroupService,
    EntRealroomService,
    EntVideoService,
    OperationLogService,
    OrderDetailService,
    OrderListService,
    PayinfoService,
    UserContactsService,
    UserGroupService,
  ]
})
export class ContactsModule {
}
