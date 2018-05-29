import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PageService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询企业服务状态
  getEntServiceFn(entId: any): any {
    return this.http.get('/uc/baseresource/resource/ent/' + entId);
  }

  // 获取当前主题
  getCurrentThemeColor(entId: any): any {
    return this.http.get('/uc/ents/customize/' + entId);
  }

}
