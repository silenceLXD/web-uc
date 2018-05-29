import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {ClipboardModule} from 'ngx-clipboard';
import {HttpModule} from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';//新增行
import {AuthInterceptor} from '@services/auth.interceptor';//新增行

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {RouterModule, Routes} from '@angular/router';
// import { APP_BASE_HREF } from '@angular/common';
// import { environment } from '../environments/environment';

// import { HttpInterceptorService }   from './services/http.interceptor.service';

import {LayoutModule} from './views/layout/layout.module';
import {PageModule} from './views/page/page.module';
import {CommonService} from '@services/common.service';
import {TokenService} from '@services/token.service';
import {AuthService} from '@services/auth.service';
import {AuthGuard} from '@services/auth-guard.service';
import {FormValidators} from '@services/form-validators';
import {SettingService} from '@services/setting.service';
import {EventBusService} from '@services/event-bus.service';

// ngx-bootstrap
import {ModalModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NZ_NOTIFICATION_CONFIG} from 'ng-zorro-antd';
// 路由
import {AppRoutesModule} from './app.routes';
//自定义管道pipe
import {AllPipesModule} from '@pipes/all-pipes.module';
// 根组件
import {AppComponent} from './app.component';
// 登录组件
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';
// 观看直播
import {WatchLiveComponent} from './views/live-video/watch-live/watch-live.component';
// 播放视频
import {PlayVideoComponent} from './views/live-video/play-video/play-video.component';
// 服务条款
import {TermsServiceComponent} from './views/setting/terms-service/terms-service.component';
// 绑定手机号
import {BindPhoneComponent} from './views/setting/bind-phone/bind-phone.component';
// 忘记密码
import {ForgetPsdComponent} from './views/setting/forget-psd/forget-psd.component';
// 自定义组件
import {SetupOneComponent} from './views/setting/forget-psd/setup-one.component';
import {SetupTwoComponent} from './views/setting/forget-psd/setup-two.component';
import {SetupThreeComponent} from './views/setting/forget-psd/setup-three.component';
import {SetupFourComponent} from './views/setting/forget-psd/setup-four.component';

import {EntRegisterComponent} from './views/register/ent-register/ent-register.component';
import {PerRegisterComponent} from './views/register/per-register/per-register.component';

import {SendEmailComponent} from './views/setting/send-email/send-email.component';
import {CheckEmailComponent} from './views/setting/check-email/check-email.component';


import {TimerButtonComponent} from './views/layout/timer-button.component';
import {LoginService} from './views/login/login.service';
import {ForgetPsdService} from './views/setting/forget-psd/forget-psd.service';
import {WatchLiveService} from './views/live-video/watch-live/watch-live.service';
import {BindPhoneService} from './views/setting/bind-phone/bind-phone.service';
import {SetupOneService} from './views/setting/forget-psd/setup-one.service';
import {SetupTwoService} from './views/setting/forget-psd/setup-two.service';
import {SetupThreeService} from './views/setting/forget-psd/setup-three.service';
import {EntRegisterService} from './views/register/ent-register/ent-register.service';
import {PerRegisterService} from './views/register/per-register/per-register.service';
import {TimerButtonService} from './views/layout/timer-button.service';
import {CheckEmailService} from './views/setting/check-email/check-email.service';


//主入口组件
// import { PageComponent } from './views/page/page.component';

// 使用TranslateHttpLoader加载项目的本地语言json配置文件
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TermsServiceComponent,
    ForgetPsdComponent,
    RegisterComponent,
    WatchLiveComponent,
    PlayVideoComponent,
    BindPhoneComponent,
    // 自定义组件,
    SetupOneComponent,
    SetupTwoComponent,
    SetupThreeComponent,
    SetupFourComponent,
    EntRegisterComponent,
    PerRegisterComponent,
    TimerButtonComponent,

    SendEmailComponent,
    CheckEmailComponent,
    // PageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutesModule,//路由
    ClipboardModule,//复制
    AllPipesModule,//管道
    LayoutModule,
    PageModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    // 调用forRoot静态方法指定加载的文件
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CookieService,
    {provide: CommonService, useClass: CommonService},
    {provide: TokenService, useClass: TokenService},
    {provide: SettingService, useClass: SettingService},
    {provide: EventBusService, useClass: EventBusService},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: NZ_NOTIFICATION_CONFIG,
      useValue: {nzTop: '90px'}
    },
    {provide: AuthService, useClass: AuthService},
    AuthGuard,
    FormValidators,
    LoginService,
    ForgetPsdService,
    WatchLiveService,
    BindPhoneService,
    SetupOneService,
    SetupTwoService,
    SetupThreeService,
    EntRegisterService,
    PerRegisterService,
    TimerButtonService,
    CheckEmailService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
