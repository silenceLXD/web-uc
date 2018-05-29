import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TreeviewComponent} from './treeview.component';
import {TreeviewItemComponent} from './treeview-item.component';
import {TreeviewPipe} from './treeview.pipe';
import {TreeviewI18n, TreeviewI18nDefault} from './treeview-i18n';
import {TreeviewConfig} from './treeview-config';
import {TreeviewEventParser, DefaultTreeviewEventParser} from './treeview-event-parser';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    TreeviewComponent,
    TreeviewItemComponent,
    TreeviewPipe,
  ], exports: [
    TreeviewComponent,
    TreeviewPipe,
  ],
  providers: [
    TreeviewConfig,
    {provide: TreeviewI18n, useClass: TreeviewI18nDefault},
    {provide: TreeviewEventParser, useClass: DefaultTreeviewEventParser}
  ]
})
export class TreeviewModule {
}
