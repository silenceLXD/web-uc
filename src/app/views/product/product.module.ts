import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductRoutesModule} from './product.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllPipesModule} from '@pipes/all-pipes.module';
import {AlertModule, ModalModule, PaginationModule, TabsModule} from 'ngx-bootstrap';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from 'app/views/product/product-detail/product-detail.component';
import {SliderDateComponent} from './slider-date.component';
import {ProductDetailService} from './product-detail.service';
import {ProductListService} from './product-list.service';

@NgModule({
  imports: [
    ProductRoutesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    SliderDateComponent,
  ],
  providers: [
    ProductDetailService,
    ProductListService
  ]
})
export class ProductModule {
}
