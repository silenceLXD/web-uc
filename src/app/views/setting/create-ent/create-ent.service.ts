import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class CreateEntService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 下一步
  nextStep(data: any): any {
    return this.http.post('/uc/ents/person/user/create/ent', data);
  }

}
