import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {CommonService} from '@services/common.service';


@Injectable()
export class TokenService {
  private apiBase = environment.apiBase;

  refreshInterval: any = null;

  constructor(private commonService: CommonService,
              private http: Http,
              private router: Router) {
    const longtime: any = this.commonService.getCookie('uc_expires_in');
    const interTime = (longtime * 1000 / 3).toFixed();
    if (longtime) {
      this.refreshInterval = setInterval(() => {
        this.refreshToken();
      }, interTime); // longtime * 1000 / 3
    }

  }

  // public loginUserData = this.commonService.getLoginMsg();
  // authTokens:any = this.locTokenType+" "+this.locAccessToken;
  // authTokens:string = "Bearer "+this.locAccessToken;
  getToken() {
    const locTokenType = this.commonService.getCookie('uc_token_type');
    const locAccessToken = this.commonService.getCookie('uc_access_token');
    return 'Bearer ' + locAccessToken;
  }


  // 刷新access_token
  refreshToken() {
    const tokenData = 'grant_type=refresh_token&scope=web&client_id=2513608755203&client_secret=32b42c8d694d520d3e321&refresh_token=' + this.commonService.getCookie('uc_refresh_token');
    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    return this.http.post(this.apiBase + '/oauth/token', tokenData, {headers: headers})
      .toPromise()
      .then(response => {
        const data = response.json();
        this.commonService.setCookie('uc_access_token', data.access_token, data.expires_in);
        this.commonService.setCookie('uc_refresh_token', data.refresh_token, data.expires_in);
        this.commonService.setCookie('uc_expires_in', data.expires_in, data.expires_in);
        this.commonService.setCookie('uc_isLogin', 'true', data.expires_in);
      })
      .catch(err => {
        // console.log(err)
        const errData = err;
        if (+err.status === 401) {
          this.commonService.deletAllLoginData(); // 清除cookies，localStorage，并返回登录
        }
      });
  }


}
