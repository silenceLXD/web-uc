import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MeetingRoutesModule} from './meeting.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ClipboardModule} from 'ngx-clipboard';
import {TreeviewModule} from '../plugins/treelib/treeview.module';
import {MeetingControlBtnModule} from '../layout/meeting-control-btn.module';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {AddAttendComponent} from './add-attend/add-attend.component';
import {BookComponent} from './book/book.component';
import {BookDetailComponent} from './book/book-detail/book-detail.component';
import {ConferenceManagementComponent} from './conference-management/conference-management.component';
import {EntRoomComponent} from './ent-room/ent-room.component';
import {HistoryDetailComponent} from './history/history-detail/history-detail.component';
import {LiveComponent} from './live/live.component';
import {MeetingControlComponent} from './meeting-control/meeting-control.component';
import {meetingRequestComponent} from './meeting-control/meeting-request.component';
import {meetingVoteComponent} from './meeting-control/meeting-vote.component';
import {SplitModelComponent} from './meeting-control/split-model/split-model.component';
import {EntScheduleComponent} from './schedule/ent-schedule/ent-schedule.component';
import {HistoryScheduleComponent} from './schedule/history-schedule/history-schedule.component';
import {EntHistoryComponent} from './history/ent-history/ent-history.component';
import {JoinComponent} from './join/join.component';
import {AddAttendService} from './add-attend.service';
import {BookDetailService} from './book-detail.service';
import {BookService} from './book.service';
import {ConferenceManagementService} from './conference-management.service';
import {EntRoomService} from './ent-room.service';
import {EntHistoryService} from './ent-history.service';
import {HistoryDetailService} from './history-detail.service';
import {JoinService} from './join.service';
import {LiveService} from './live.service';
import {SplitModelService} from './split-model.service';
import {MeetingControlService} from './meeting-control/meeting-control.service';
import {MeetingRequestService} from './meeting-request.service';
import {MeetingVoteService} from './meeting-vote.service';
import {EntScheduleService} from './ent-schedule.service';
import {HistoryScheduleService} from './history-schedule.service';

@NgModule({
  imports: [
    MeetingRoutesModule,
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
    ClipboardModule,
    TreeviewModule,
    MeetingControlBtnModule,
    InfiniteScrollModule
  ],
  declarations: [
    AddAttendComponent,
    BookComponent,
    BookDetailComponent,
    ConferenceManagementComponent,
    EntRoomComponent,
    EntHistoryComponent,
    HistoryDetailComponent,
    JoinComponent,
    LiveComponent,
    MeetingControlComponent,
    meetingRequestComponent,
    meetingVoteComponent,
    SplitModelComponent,
    EntScheduleComponent,
    HistoryScheduleComponent,
  ],
  providers: [
    AddAttendService,
    BookDetailService,
    BookService,
    ConferenceManagementService,
    EntRoomService,
    EntHistoryService,
    HistoryDetailService,
    JoinService,
    LiveService,
    SplitModelService,
    MeetingControlService,
    MeetingRequestService,
    MeetingVoteService,
    EntScheduleService,
    HistoryScheduleService,
  ]
})
export class MeetingModule {
}
