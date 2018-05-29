import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrls: ['./terms-service.component.css']
})
export class TermsServiceComponent implements OnInit {
  nowDate:any; //当前年份
  CorporateName:string; //简称
  CorporateFullName:string; //全称
  constructor(private translate: TranslateService) {
    this.nowDate = new Date().getFullYear();
    translate.get('entName').subscribe((res: string) => {
      this.CorporateName = res;
    });
    translate.get('entFullName').subscribe((res: string) => {
      this.CorporateFullName = res;
    });
  }

  ngOnInit() {
  }

}
