import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {MeetingControlBtnModule} from '../layout/meeting-control-btn.module';
import {MessageComponent} from './message.component';
import {MessageRoutesModule} from './message.routes';
import {MessageService} from './message.service';

@NgModule({
  imports: [
    MessageRoutesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    // MeetingControlBtnModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    MessageComponent
  ],
  providers: [
    MessageService
  ]
})
export class MessageModule {
}

