import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class BindPhoneService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 首次登陆 没密码的
  sureBindPassword(data: any): any {
    return this.http.patch('/uc/user/binding/mobile', data);
  }

  // 首次登陆，绑定手机和修改默认密码 有密码的
  sureBindHasPassword(data: any): any {
    return this.http.post('/uc/user/binding/mobile/password', data);
  }

  // 首次登陆，非微信进入绑定手机和修改默认密码
  sureBindPhone(data: any): any {
    return this.http.post('/uc/user/login/update/phone/pwd', data);
  }

  // 微信登录
  weChatLoginFn(data: any): any {
    return this.http.post('/uc/weChatQrCodeLogin', data);
  }

  // 获取用户数据
  getUserData(userId: any): any {
    return this.http.get('/uc/user/' + userId);
  }

}
