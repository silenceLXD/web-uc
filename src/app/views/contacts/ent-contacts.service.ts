import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntContactsService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询获取 组织列表
  getCustomizeEntList(entId: any, searchByName: any): any {
    return this.http.get('/uc/user/ents/' + entId + '/orgs?searchInput=' + searchByName);
  }

  // 组织id查询通讯录用户(orgLevel:0表示entId是公司，1表示entId是一级部门，2表示entId是2级部门，3表示entId是3级部门)
  applyTemplateFn(orgId: any, orgLevel: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/user/ents/' + orgId + '/users/' + orgLevel + getData);
  }

  getEntPosition(): any {
    return this.http.get('/uc/user/ent/position');
  }

  // 查询企业的最大sip数量
  getSipCount(): any {
    return this.http.get('/uc/user/entservice/ent');
  }

  // 查询企业剩余多少账号数
  getSipRemaining(): any {
    return this.http.get('/uc/ents/sip/remaining');
  }

  // 编辑部门名称
  editOrgName(orgId: any, data: any): any {
    return this.http.post('/uc/organization/update/' + orgId, data);
  }

  // 添加部门分公司
  saveBtn_ok(orgLevel: any, value: any, data: any): any {
    return this.http.post('/uc/organization/add/' + orgLevel + '/' + value, data);
  }

  // 点击添加子部门
  saveAddOtherFn(orgLevel: any, parentOrgId: any, data: any): any {
    return this.http.post('/uc/organization/add/' + orgLevel + '/' + parentOrgId, data);
  }

  // 确定删除部门
  sureDeleteDepatFn(parentOrgId: any): any {
    return this.http.delete('/uc/organization/' + parentOrgId);
  }

  // 提交表单
  saveAddUserFn(data: any): any {
    return this.http.post('/uc/user', data);
  }

  // 编辑
  sureUpdateUserFn(userId: any, data: any): any {
    return this.http.post('/uc/user/' + userId, data);
  }

  // 删除用户
  sureDeleteUserFn(userId: any): any {
    return this.http.delete('/uc/user/' + userId);
  }

  // 重置用户密码
  sureRestPwdFn(data: any): any {
    return this.http.post('/uc/user/password', data);
  }

  // 下载通讯录模板
  downloadBookTemplate(userId: any): any {
    return '/uc/user/download/template/' + userId;
  }

  // 导入通讯录第一步
  uploadBtn_ok(flag: any, data: any): any {
    return this.http.post('/uc/user/ent/excel/data/' + flag, data);
  }

  // 导入通讯录第二步
  saveImportSecond(): any {
    return this.http.get('/uc/user/ent/validation/data/repetition');
  }

  // 确定导入 -- 导入第三步
  insertUser(): any {
    return this.http.get('/uc/user/ent/excel/data/user');
  }

  // 导出通讯录
  exportBook(userId: any): any {
    return '/uc/user/download/template/' + userId;
  }

  // 根据entid 获取一级部门数据
  getFirstDepat(id: any): any {
    return this.http.get('/uc/organization/select/' + id);
  }

  // 根据entid 获取二级部门数据
   getSecondDepat(id: any): any {
    return this.http.get('/uc/organization/select/' + id);
  }

  // 根据entid 获取三级部门数据
   getThirdDepat(id: any): any {
    return this.http.get('/uc/organization/select/' + id);
  }
  // 获取部门数据
   getDepatFn(parentId: any): any {
    return this.http.get('/uc/organization/select/' + parentId);
  }

}
