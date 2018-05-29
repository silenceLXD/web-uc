import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  // 手机号／邮箱 登录
  postFormData(data: any): any {
    return this.http.post('/uc/login', data);
  }

  // 获取登录的二维码信息
  getCodeInfo(): any {
    return this.http.get('/uc/user/qrCode');
  }

  // 微信登录
  weixinLogin(): any {
    return this.http.get('/uc/wechat/wxLogin/config');
  }

}
