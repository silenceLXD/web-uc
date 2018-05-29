import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class HeaderService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取消息总数和已读数
  getMsgCount(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/message/count' + getData);
  }

  getEntDataFn(entId: any): any {
    return this.http.get('/uc/ents/' + entId);
  }

  // 确定入会设置
  renewalsOrderFn(entId: any, data: any): any {
    return this.http.patch('/uc/ents/' + entId + '/conferences/setting', data);
  }
  // 确定退出登录logout
  sureLogoutFn(): any {
    return this.http.post('/uc/logout', '');
  }

}
