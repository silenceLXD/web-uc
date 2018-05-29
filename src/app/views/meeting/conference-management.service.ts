import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class ConferenceManagementService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  meetingOnGongSelect(entId: any) {
    return this.http.get('/uc/' + entId + '/conferences/starting');
  }

}
