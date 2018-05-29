import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserScheduleComponent} from './user-schedule/user-schedule.component';
import {ScheduleDetailComponent} from './schedule-detail/schedule-detail.component';
import {UserRoomComponent} from './user-room/user-room.component';
import {UserHistoryComponent} from './user-history/user-history.component';
import {UserVideoComponent} from './user-video/user-video.component';


const myMeetingRoutesModule: Routes = [
  {path: 'user-schedule', component: UserScheduleComponent},
  {path: 'schedule-detail/:mid', component: ScheduleDetailComponent},
  {path: 'user-room', component: UserRoomComponent},
  {path: 'user-history', component: UserHistoryComponent},
  {path: 'user-video', component: UserVideoComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(myMeetingRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class MyMeetingRoutesModule {
}
