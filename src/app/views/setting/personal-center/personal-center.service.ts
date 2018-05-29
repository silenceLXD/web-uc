import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PersonalCenterService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取个人信息
  getUserList(userId: any): any {
    return this.http.get('/uc/user/' + userId);
  }

  // 确定修改姓名
  saveEditRealName(data: any): any {
    return this.http.post('/uc/user/name', data);
  }

  // 获取短信验证码
  getPhoneCode(data: any): any {
    return this.http.post('/uc/common/verificationCode', data);
  }

  // 绑定修改手机号
  relieveEditPhone(mobilePhone: any, data: any): any {
    return this.http.post('/uc/user/bind/phone/' + mobilePhone + '/1', data);
  }

  // 绑定新手机号
  relieveNewPhone(oldPhone: any, data: any): any {
    return this.http.post('/uc/user/bind/phone/' + oldPhone + '/2', data);
  }

  // 确定退出
  saveQuitEntFn(userId: any): any {
    return this.http.post('/uc/user/quit/' + userId, '');
  }

  // 绑定微信
  bindWeChatFn(): any {
    return this.http.get('/uc/wechat/wxBind/config');
  }

  // 确定解绑微信
  unBindWeChat(): any {
    return this.http.patch('/uc/user/unbinding/wechat', {});
  }

  // 确定修改登录密码
  saveEditPw(passWord: any): any {
    return this.http.post('/uc/user/password', passWord);
  }

  // 确定修改Sip密码
  saveEditSIP(sipPassWord: any): any {
    return this.http.post('/uc/user/sip/password', sipPassWord);
  }

}
