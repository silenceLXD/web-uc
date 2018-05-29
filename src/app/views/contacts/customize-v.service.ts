import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class CustomizeVService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 通过企业ID查询企业订制信息
  getCustomizeEntList(entId: any): any {
    return this.http.get('/uc/ents/customize/' + entId);
  }

  // 修改企业模板
  applyTemplateFn(entId: any, istpl: any): any {
    return this.http.post('/uc/ents/' + entId + '/' + istpl, '');
  }

  // 检测 域名
  checkDomain(entDomain: any): any {
    return this.http.get('/' + entDomain + '/uc/ents/testIP');
  }
  // 上传企业logo文件
  updateConfigFn(data: any): any {
    return this.http.post('/uc/ents/upload/logo/file', data);
  }
  // 保存企业个性化地址
  updateCollocate(data: any): any {
    return this.http.post('/uc/ents/setting/', data);
  }
  // 根据企业ID获取企业信息
  getEntUserInfo(entId: any): any {
    return this.http.get('/uc/ents/' + entId);
  }

}
