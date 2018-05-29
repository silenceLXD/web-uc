import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {NgForm} from '@angular/forms';
import {EntRealroomService} from '../ent-realroom.service';

@Component({
  selector: 'app-ent-realroom',
  templateUrl: './ent-realroom.component.html',
  styleUrls: ['./ent-realroom.component.css']
})
export class EntRealroomComponent implements OnInit, AfterViewInit, OnDestroy {

  // 是否可用
  isAvailableOne: boolean;

  roomId: any; //会议室编号

  meetingName: string = ''; //添加会议室名称
  orgId: any; //组织Id
  searchData: any;

  isFirstDepatFormDisabledButton = true; // 添加会议室禁用按钮状态
  isEditRoomFormDisabledButton = true; // 编辑会议室禁用按钮状态
  unFirstDepatForm: any; // 订阅的对象
  unEditRoomForm: any; // 订阅的对象

  public loginUserData = this.commonService.getLoginMsg();
  entId: any = this.loginUserData.entId;

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private entRealroomService: EntRealroomService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
    //查询数据数初始化
    this.searchData = {
      pageNum: '1', //第几页
      pageSize: '10',  //每页多少条
      queryStr: ''//会议名称
    };
  }

  @ViewChild('firstDepatForm') firstDepatForm: NgForm;
  @ViewChild('editRoomForm') editRoomForm: NgForm;

  ngOnInit() {
    this.isAvailableOne = this.commonService.getAvailableThree();
    this.getRealroom();
    this.getOrganizationList();
  }

  ngAfterViewInit(): void {
    // 订阅表单值改变事件
    this.unFirstDepatForm = this.firstDepatForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onFirstDepatFormValueChanged(data);
      });
    this.unEditRoomForm = this.editRoomForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onEditRoomFormValueChanged(data);
      });
  }

  ngOnDestroy() {
    this.unFirstDepatForm.unsubscribe();
    this.unEditRoomForm.unsubscribe();
  }

  onFirstDepatFormValueChanged(data) {
    this.isFirstDepatFormDisabledButton = this.firstDepatForm.valid;
  }

  onEditRoomFormValueChanged(data) {
    this.isEditRoomFormDisabledButton = this.editRoomForm.valid;
  }

  // 查询组织列表
  getOrganizationList() {
    return this.entRealroomService.getOrganizationList(this.entId).subscribe(
      res => {
        const dataList: any = res;
        this.orgId = dataList.data.value;
      },
      err => {
        console.log(err);
      }
    );
  }

  public tableData: any = {//表格数据
    list: [],
    totalPages: 0,
    currentPage: 1
  };

  // 查找会议室列表
  getRealroom() {
    // let getData = this.commonService.formObject(this.searchData);
    this.entRealroomService.getRealroom(this.entId, this.searchData).subscribe(
      res => {
        const resultData: any = res;
        this.tableData = {
          list: resultData.data.list,
          totalPages: resultData.data.total,
          currentPage: resultData.data.pageNum
        };
      },
      err => {
        console.log(err);
      }
    );
  }

  //分页
  pageChanged(pagenum: any) {
    this.searchData.pageNum = pagenum;
    // alert(pagenum)
    this.tableData.currentPage = pagenum;
    this.getRealroom();
  }

  // 搜索会议室
  searchMeetingRoom() {
    this.getRealroom();
  }

  // 添加会议室
  AddMeetingModal = false;

  AddMeetingRoom() {
    this.AddMeetingModal = true;
    this.meetingName = '';
  }

  // 保存添加会议室
  saveBtn_ok() {
    const getData = {
      'realName': this.meetingName,
      'orgId': this.orgId
    };
    this.entRealroomService.saveBtn_ok(getData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '添加成功', '');
          this.getRealroom();
          this.AddMeetingModal = false;
        } else {
          this._notification.create('error', '添加失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  // 删除会议室
  // deleteModal: boolean = false;
  deleteRoomFn = (roomid: any) => {
    this.confirmServ.confirm({
      title: '删除',
      content: '是否确认删除此会议室？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.deleteBtn_ok(roomid);
      },
      onCancel() {
      }
    });
  };

  // 确定删除会议室
  deleteBtn_ok(roomid: any) {
    this.entRealroomService.deleteBtn_ok(roomid).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '删除成功', '');
          this.getRealroom();
        } else {
          this._notification.create('error', '删除失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }


  //编辑会议室
  editRoomModal = false;
  editRoomData: any = {
    realName: '',
    sipPassword: '',
    sipNumber: '',
    userId: ''
  };

  editRoomFn(data: any) {
    this.editRoomModal = true;
    this.editRoomData = {
      realName: data.realName,
      sipPassword: data.sipPassword,
      sipNumber: data.sipNumber,
      userId: data.userId,
    };
  }

  sureEditRoomFn(data: any) {
    const postData = {
      sipPassword: data.sipPassword,
      realName: data.realName,
      sipNumber: data.sipNumber
    };
    const roomid = data.userId;
    this.entRealroomService.sureEditRoomFn(roomid, postData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.editRoomModal = false;
          this._notification.create('success', '修改成功', '');
          this.getRealroom();
        } else {
          this._notification.create('error', '修改失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

}
