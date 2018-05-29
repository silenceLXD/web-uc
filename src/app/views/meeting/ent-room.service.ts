import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class EntRoomService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 获取会议室列表 表格数据
  getTableDataFn(entId: any, data: any) {
    const getData = this.commonService.formObject(data);
    return this.http.get('/uc/ents/' + entId + '/rooms' + getData);
  }

  // 编辑保存  修改会议室所属者或名称
  sureUpdateRoomFn(vmrNumber: any, data: any) {
    return this.http.post('/uc/rooms/' + vmrNumber + '/owner', data);
  }

  // 查询授权列表参数
  getChooseMember(data: any) {
    return this.http.post('/uc/user/ent/vmr', data);
  }

  // 选择联系人 选择一级部门
  getChooseLevelContact(paramId: any) {
    return this.http.get('/uc/organization/select/' + paramId);
  }

  // 查询职位
  getQueryPositions() {
    return this.http.get('/uc/user/ent/position');
  }

}
