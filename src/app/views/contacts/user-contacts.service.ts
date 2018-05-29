import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserContactsService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询获取 组织列表
  getOrganizationList(entId: any, searchByName: any) {
    return this.http.get('/uc/user/ents/' + entId + '/orgs?searchInput=' + searchByName);
  }

  // 获取职务列表
  getEntPosition(): any {
    return this.http.get('/uc/user/ent/position');
  }

  // 组织id查询通讯录用户(orgLevel:0表示entId是公司，1表示entId是一级部门，2表示entId是2级部门，3表示entId是3级部门)
  getOrganUser(orgId: any, orgLevel: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/user/ents/' + orgId + '/users/' + orgLevel + getData);
  }

  // 添加收藏 方法
  addCollectUser(data: any): any {
    return this.http.post('/uc/user/addressbook', data);
  }

  // 取消收藏 方法 friendUserId 好友id
  delCollectUser(friendUserId: any): any {
    return this.http.delete('/uc/user/addressbook/' + friendUserId);
  }

  // 查看个人收藏列表
  toUserCollection(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/user/user-addressbook/search' + getData);
  }

}
