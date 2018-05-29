import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';


const productRoutesModule: Routes = [
  {path: 'product-list', component: ProductListComponent},
  {path: 'product-detail/:pid', component: ProductDetailComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(productRoutesModule),
  ],
  exports: [
    RouterModule
  ]
})
export class ProductRoutesModule {
}
