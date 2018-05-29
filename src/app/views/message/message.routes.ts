import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessageComponent} from './message.component';


const messageRoutesModule: Routes = [
  // {path: '', redirectTo: 'home-page', pathMatch: 'full'},
  // {pathMatch: 'full', path: '', component: MessageComponent},
  {path: '', component: MessageComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(messageRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class MessageRoutesModule {
}
