import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class BookService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 查询发起会议模板
  getTemplate(type: any, infoId: any) {
    return this.http.get('/uc/conferences/template?type=' + type + '&infoId=' + infoId);
  }

  // 发起会议 （提交）
  submitFormDataFn(val: any) {
    return this.http.post('/uc/conferences/launch', val);
  }

}
