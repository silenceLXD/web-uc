import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountBalanceComponent} from './account-balance/account-balance.component';
import {ConsumptionAllComponent} from './consumption-all/consumption-all.component';
import {ConsumptionDetailComponent} from './consumption-detail/consumption-detail.component';
import {PersonalConsumptionComponent} from './personal-consumption/personal-consumption.component';
import {PersonalDetailComponent} from './personal-detail/personal-detail.component';
import {RechargeComponent} from './recharge/recharge.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ConsumptionRoutesModule} from './consumption.routes';
import {NgxEchartsModule} from 'ngx-echarts';
import {AccountBalanceService} from './account-balance.service';
import {ConsumptionAllService} from './consumption-all.service';
import {ConsumptionDetailService} from './consumption-detail.service';
import {PersonalConsumptionService} from './personal-consumption.service';
import {PersonalDetailService} from './personal-detail.service';
import {RechargeService} from './recharge.service';


@NgModule({
  imports: [
    ConsumptionRoutesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    NgxEchartsModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    AccountBalanceComponent,
    ConsumptionAllComponent,
    ConsumptionDetailComponent,
    PersonalConsumptionComponent,
    PersonalDetailComponent,
    RechargeComponent
  ],
  providers: [
    AccountBalanceService,
    ConsumptionAllService,
    ConsumptionDetailService,
    PersonalConsumptionService,
    PersonalDetailService,
    RechargeService
  ]
})
export class ConsumptionModule {
}
