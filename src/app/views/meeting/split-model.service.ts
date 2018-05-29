import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class SplitModelService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取分屏信息及轮询的人
  getSplitScreen(inputParentData: any) {
    return this.http.get('/uc/conferences/' + inputParentData + '/split-screen');
  }

}
