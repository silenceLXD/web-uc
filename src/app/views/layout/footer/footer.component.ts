import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  nowDate: any;
  isShowFooter: any; //是否显示footer
  public footerLinksArr:any;//footer链接
  footerIcp:any; //ICP备号
  footerCompany:any; //版权所有

  constructor(private translate: TranslateService) {
    this.nowDate = new Date().getFullYear();
    translate.get('footer.IS_SHOWFOOTER').subscribe((res: any) => {
      this.isShowFooter = res;
    });
    translate.get('footer.FOOTER_LINKS').subscribe((res: any) => {
      this.footerLinksArr = res;
    });
    translate.get('footer.FOOTER_ICP').subscribe((res: any) => {
      this.footerIcp = res;
    });
    translate.get('footer.FOOTER_COMPANY',{fullYear: this.nowDate}).subscribe((res: any) => {
      this.footerCompany = res;
    });
  }


  ngOnInit() {
  }

}
