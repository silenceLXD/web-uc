import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConferenceManagementComponent} from './conference-management/conference-management.component';
import {MeetingControlComponent} from './meeting-control/meeting-control.component';
import {EntScheduleComponent} from './schedule/ent-schedule/ent-schedule.component';
import {HistoryScheduleComponent} from './schedule/history-schedule/history-schedule.component';
import {EntHistoryComponent} from './history/ent-history/ent-history.component';
import {HistoryDetailComponent} from './history/history-detail/history-detail.component';
import {EntRoomComponent} from './ent-room/ent-room.component';
import {BookComponent} from './book/book.component';
import {BookDetailComponent} from './book/book-detail/book-detail.component';
import {JoinComponent} from './join/join.component';
import {LiveComponent} from './live/live.component';


const meetingRoutesModule: Routes = [
  {path: 'conference-management', component: ConferenceManagementComponent},
  {path: 'meeting-control/:cid', component: MeetingControlComponent},
  {path: 'ent-schedule', component: EntScheduleComponent},
  {path: 'history-schedule/:type', component: HistoryScheduleComponent},
  {path: 'ent-history', component: EntHistoryComponent},
  {path: 'history-detail/:cid/:type', component: HistoryDetailComponent},
  {path: 'ent-room', component: EntRoomComponent},
  {path: 'book/:appointid/:appointType', component: BookComponent},
  {path: 'book-detail/:mid', component: BookDetailComponent},
  {path: 'join', component: JoinComponent},
  {path: 'live', component: LiveComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(meetingRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class MeetingRoutesModule {
}
