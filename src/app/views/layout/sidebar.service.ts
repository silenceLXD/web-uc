import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SidebarService {

  constructor(private http: HttpClient) {
  }

  // 获取菜单
  getMenuFn(flag: any): any {
    return this.http.get('/uc/user/menus/' + flag);
  }

}
