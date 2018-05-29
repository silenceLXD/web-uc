import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ScheduleDetailComponent} from './schedule-detail/schedule-detail.component';
import {UserHistoryComponent} from './user-history/user-history.component';
import {UserRoomComponent} from './user-room/user-room.component';
import {UserScheduleComponent} from './user-schedule/user-schedule.component';
import {UserVideoComponent} from 'app/views/myMeeting/user-video/user-video.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MyMeetingRoutesModule} from './my-meeting.routes';
import {MeetingControlBtnModule} from '../layout/meeting-control-btn.module';
import {ScheduleDetailService} from './schedule-detail.service';
import {UserHistoryService} from './user-history.service';
import {UserRoomService} from './user-room.service';
import {UserScheduleService} from './user-schedule.service';
import {UserVideoService} from './user-video.service';

@NgModule({
  imports: [
    MyMeetingRoutesModule,
    MeetingControlBtnModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    NgxEchartsModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot(),
    ClipboardModule
  ],
  declarations: [
    ScheduleDetailComponent,
    UserHistoryComponent,
    UserRoomComponent,
    UserScheduleComponent,
    UserVideoComponent
  ],
  providers: [
    ScheduleDetailService,
    UserHistoryService,
    UserRoomService,
    UserScheduleService,
    UserVideoService
  ]
})
export class MyMeetingModule {
}
