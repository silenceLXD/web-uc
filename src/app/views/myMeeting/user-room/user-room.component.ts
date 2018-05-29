import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@services/common.service';
import {SettingService} from '@services/setting.service';
import {UserRoomService} from '../user-room.service';

@Component({
  selector: 'app-user-room',
  templateUrl: './user-room.component.html',
  styleUrls: ['./user-room.component.css']
})
export class UserRoomComponent implements OnInit {
  // 是否可用
  isAvailableOne: boolean;
  isAvailableTwo: boolean;
  public loginUserData = this.commonService.getLoginMsg();
  USERID: any = this.loginUserData.userId;
  settingData: any;//获取设置文件数据
  webRtcUrl: any;//webrtc入会连接
  constructor(private http: HttpClient,
              private _notification: NzNotificationService,
              private setting: SettingService,
              private userRoomService: UserRoomService,
              private commonService: CommonService) {
    this.settingData = setting.getVcsSetting();
  }

  msgalert = true;

  /******************** 初始化声明 ******************/
  // =======表格显示数据

  ngOnInit() {
    this.webRtcUrl = this.settingData.WEBRTC_URL;
    this.isAvailableOne = this.commonService.getAvailableTwo();
    this.isAvailableTwo = this.commonService.getAvailableSix();
    this.getTableDataFn();
  }

  //获取会议室列表 表格数据
  /* 表格列表数据初始化 */
  ficData: any;

  getTableDataFn() {
    return this.userRoomService.getTableDataFn(this.USERID).subscribe(
      res => {
        let resultData: any = res;
        if (resultData.code == 200) {
          this.ficData = resultData.data;
        }
      },
      err => {
        console.log(err);
      });
  }

  /************** 初始化 end ****************/

    //编辑
  editRoomModal = false;
  editData: any = {
    vmrNumber: '',
    vmrName: '',
    participantPin: '',
  };

  editFicFn(data: any) {
    if (data.status == 2) {
      this._notification.create('error', '会议室使用中暂不可编辑', '');
    } else {
      this.editRoomModal = true;
      this.editData = {
        vmrNumber: data.vmrNumber,
        vmrName: data.vmrName,
        participantPin: data.participantPin
      };
    }


  }

  // 确定编辑 修改专属会议室
  submitUpdateFn(data: any) {
    //vmrName:会议室名称; participantPin:访客密码
    const postData = {'vmrName': data.vmrName, 'participantPin': data.participantPin};
    this.userRoomService.submitUpdateFn(data.vmrNumber, postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '修改成功', '');
          this.getTableDataFn();
          this.editRoomModal = false;
        } else {
          this._notification.create('error', resultData.msg, '');
        }
      },
      err => {
        console.log(err);
      });
  }

}
