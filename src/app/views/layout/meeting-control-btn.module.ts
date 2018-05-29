import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MeetingControlBtnComponent} from './meeting-control-btn.component';
import {MeetingControlBtnService} from './meeting-control-btn.service';


@NgModule({
  declarations: [
    MeetingControlBtnComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    MeetingControlBtnComponent
  ],
  providers: [MeetingControlBtnService]
})
export class MeetingControlBtnModule {
}
