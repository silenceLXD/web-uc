import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class LiveService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询企业直播列表
  getLiveListFn(entId: any) {
    return this.http.get('/uc/' + entId + '/lives');
  }

}
