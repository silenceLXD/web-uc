import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class UserGroupService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取公开群组
  getUserGroup(searchName: any) {
    return this.http.get('/uc/userGroup/find/open?groupName=' + searchName);
  }

  // 获取我的群组
  getUserGroupList(searchName: any): any {
    return this.http.get('/uc/userGroup/groups?groupname=' + searchName);
  }

  // 根据群组编号获取该组中所有人员信息
  getGroupIdList(groupId: any, data: any): any {
    return this.http.get('/uc/userGroup/find/user/' + groupId + data);
  }

  // 获取该分组以外的其他分组
  getUserGroupOther(groupId: any): any {
    return this.http.get('/uc/userGroup/other/user/' + groupId);
  }

  // 获取联系人列表
  getContactsList(data: any): any {
    return this.http.post('/uc/userGroup/entuser/inGroup', data);
  }

  // 编辑分组内人员
  getGroupUserList(groupId: any, data: any): any {
    return this.http.post('/uc/userGroup/update/user/' + groupId, data);
  }

  // 选择联系人 选择一级部门
  getChooseLevelContact(paramId: any): any {
    return this.http.get('/uc/organization/select/' + paramId);
  }

  // 查询职位
  getQueryPositions(): any {
    return this.http.get('/uc/user/ent/position');
  }

  // 确定移动
  moveGroupOk(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.patch('/uc/userGroup/move/user' + getData, '');
  }

  // 确定复制
  copyGroupOk(data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.patch('/uc/userGroup/copy/user' + getData, '');
  }

  // 删除
  deleteGroupRepeatFn(groupId: any, userId: any): any {
    return this.http.delete('/uc/userGroup/user/' + groupId + '/' + userId);
  }

  // 根据分组ID删除分组信息
  saveDeleteGroup(groupId: any): any {
    return this.http.delete('/uc/userGroup/' + groupId);
  }

  // 修改分组名称
  editGroupName(groupId: any, data: any): any {
    return this.http.post('/uc/userGroup/update/name/' + groupId, data);
  }

  // 确定添加群组
  saveAddGroupFn(data: any): any {
    return this.http.post('/uc/userGroup/user', data);
  }
}
