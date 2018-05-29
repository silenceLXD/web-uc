import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class PersonalHomeService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取跳转链接所需参数
  getPathDataFn(): any {
    return this.http.get('/uc/support/room', {});
  }

}
