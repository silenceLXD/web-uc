import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsumptionAllComponent} from './consumption-all/consumption-all.component';
import {ConsumptionDetailComponent} from './consumption-detail/consumption-detail.component';
import {PersonalConsumptionComponent} from './personal-consumption/personal-consumption.component';
import {AccountBalanceComponent} from './account-balance/account-balance.component';
import {PersonalDetailComponent} from './personal-detail/personal-detail.component';
import {RechargeComponent} from './recharge/recharge.component';


const consumptionRoutesModule: Routes = [
  // {path: '', component: ConsumptionComponent},
  // {pathMatch: 'full', path: '', component: MessageComponent},
  // {path: '', redirectTo: 'consumption-all', pathMatch: 'full'},
  {path: 'consumption-all', component: ConsumptionAllComponent},
  {path: 'consumption-detail', component: ConsumptionDetailComponent},
  {path: 'personal-consumption', component: PersonalConsumptionComponent},
  {path: 'account-balance', component: AccountBalanceComponent},
  {path: 'personal-detail', component: PersonalDetailComponent},
  {path: 'recharge/:receivable', component: RechargeComponent},
  /*{
    path: '', component: ConsumptionComponent, children: [
    {path: 'consumption-all', component: ConsumptionAllComponent},
    {path: 'consumption-detail', component: ConsumptionDetailComponent},
    {path: 'personal-consumption', component: PersonalConsumptionComponent},
    {path: 'account-balance', component: AccountBalanceComponent},
    {path: 'personal-detail', component: PersonalDetailComponent},
    {path: 'recharge/:receivable', component: RechargeComponent},
  ]
  },*/
];


@NgModule({
  imports: [
    RouterModule.forChild(consumptionRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class ConsumptionRoutesModule {
}
