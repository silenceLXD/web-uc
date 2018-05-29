import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {LayoutRoutesModule} from './layout.routes';

import {HeaderComponent} from './header/header.component';
import {HeaderUnComponent} from './header-un/header-un.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderService} from './header.service';
import {SidebarService} from './sidebar.service';


@NgModule({
  declarations: [
    HeaderComponent,
    HeaderUnComponent,
    SidebarComponent,
    FooterComponent,
    // TimerButtonComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    LayoutRoutesModule,
    NgZorroAntdModule.forRoot(),
  ],
  exports: [
    HeaderComponent,
    HeaderUnComponent,
    SidebarComponent,
    FooterComponent,
    // TimerButtonComponent,
  ],
  providers: [
    HeaderService,
    SidebarService,
  ]
})
export class LayoutModule {
}
