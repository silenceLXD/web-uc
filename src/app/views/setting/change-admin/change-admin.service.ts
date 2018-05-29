import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class ChangeAdminService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取用户信息
  getUserList(userId: any): any {
    return this.http.get('/uc/user/' + userId);
  }

  // 下一步
  nextStepTwo(data: any): any {
    return this.http.post('/uc/common/verificationCode/check', data);
  }

  // 获取已绑定手机的用户（除去当前用户）
  getBindPhoneList(): any {
    return this.http.get('/uc/user/bind/phone/list');
  }

  // 获取短信验证码
  getPhoneCode(data: any): any {
    return this.http.post('/uc/common/verificationCode', data);
  }

  // 保存更换企业管理员
  sureUpdateAdminFn(entId: any, data: any): any {
    const getData = this.commonService.formObject(data);
    return this.http.post('/uc/ents/change/' + entId + '/admin' + getData, '');
  }

}
