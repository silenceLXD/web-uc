import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntBookComponent} from './ent-book/ent-book.component';
import {EntContactsComponent} from './ent-contacts/ent-contacts.component';
import {EntGroupComponent} from './ent-group/ent-group.component';
import {EntRealroomComponent} from './ent-realroom/ent-realroom.component';
import {UserContactsComponent} from './user-contacts/user-contacts.component';
import {UserGroupComponent} from './user-group/user-group.component';
import {EntVideoComponent} from './ent-video/ent-video.component';
import {OrderListComponent} from './order/order-list/order-list.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import {PayinfoComponent} from './order/payinfo/payinfo.component';
import {OperationLogComponent} from './operation-log/operation-log.component';
import {CustomizeComponent} from './customize/customize.component';


const contactsRoutesModule: Routes = [
  {path: 'ent-book', component: EntBookComponent},
  {path: 'ent-contacts', component: EntContactsComponent},
  {path: 'ent-group', component: EntGroupComponent},
  {path: 'ent-realroom', component: EntRealroomComponent},
  {path: 'user-contacts', component: UserContactsComponent},
  {path: 'user-group', component: UserGroupComponent},
  {path: 'ent-video', component: EntVideoComponent},
  {path: 'order-list', component: OrderListComponent},
  {path: 'order-detail/:orderNo', component: OrderDetailComponent},
  {path: 'payinfo/:orderNo', component: PayinfoComponent},
  {path: 'operation-log', component: OperationLogComponent},
  {path: 'customize', component: CustomizeComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(contactsRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class ContactsRoutesModule {
}
