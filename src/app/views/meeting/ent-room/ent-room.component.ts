import {Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@services/common.service';
import {EntRoomService} from '../ent-room.service';


@Component({
  selector: 'app-ent-room',
  templateUrl: './ent-room.component.html',
  styleUrls: ['./ent-room.component.css']
})
export class EntRoomComponent implements OnInit {

  // 是否可用
  isAvailableOne: boolean;

  public loginUserData = this.commonService.getLoginMsg();
  ENTID: any = this.loginUserData.entId;

  searchData: any;

  constructor(private http: HttpClient,
              private _notification: NzNotificationService,
              private entRoomService: EntRoomService,
              private commonService: CommonService) {
    //查询数据数初始化
    this.searchData = {
      status: '-1', //-1 查询全部，0为空闲，2为进行中
      pageNum: '1', //第几页
      pageSize: '10',  //每页多少条
      keywords: ''//会议号、会议室名称
    };
  }

  /******************** 初始化声明 ******************/
    // =======表格显示数据
  public tableData: any = {//表格数据
    list: [],
    totalPages: 0,
    currentPage: 1
  };

  ngOnInit() {
    this.isAvailableOne = this.commonService.getAvailableThree();
    this.getTableDataFn();
  }

  //获取会议室列表 表格数据
  /* 表格列表数据初始化 */
  getTableDataFn() {
    // let getData = this.commonService.formObject(this.searchData);
    return this.entRoomService.getTableDataFn(this.ENTID, this.searchData).subscribe(
      res => {
        const resultData: any = res;
        this.tableData.list = resultData.data.list;
        this.tableData.totalPages = resultData.data.total;
        if (+resultData.data.pageNum === 0) {
          resultData.data.pageNum = 1;
        }
        this.tableData.currentPage = resultData.data.pageNum;
      },
      err => {
        console.log(err);
      });
  }

  //分页
  pageChanged(pagenum: any) {
    this.searchData.pageNum = pagenum;
    this.tableData.currentPage = pagenum;
    this.getTableDataFn();
  }

  //查询
  dataSearchFn() {
    this.getTableDataFn();
  }

  /************** 初始化 end ****************/

    //编辑会议室
  ownerId: any;
  editRoomModal = false;
  updateOwnerData: any = {
    vmrNumber: '',
    vmrName: '',
  };
  checkedMember: any = {
    realName: ''
  };

  updateOwnerFn(listData: any) {
    this.checkedMember.realName = listData.realName;
    this.ownerId = listData.ownerId;
    if (listData.status == 2) {
      this._notification.create('error', '会议室使用中暂不可编辑', '');
    } else {
      this.updateOwnerData.vmrNumber = listData.vmrNumber;
      this.updateOwnerData.vmrName = listData.vmrName;
      this.editRoomModal = true;
    }
  }

  // 编辑保存  修改会议室所属者或名称
  sureUpdateRoomFn() {
    const getData = {
      'vmrName': this.updateOwnerData.vmrName,
      'ownerId': this.ownerId
    };
    return this.entRoomService.sureUpdateRoomFn(this.updateOwnerData.vmrNumber, getData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '修改成功', '');
          this.editRoomModal = false;
          this.getTableDataFn();
        } else {
          this._notification.create('error', '修改失败', '');
        }

      },
      err => {
        console.log(err);
      });
  }

  // 关闭授权
  removeMember() {
    this.checkedMember.realName = null;
    this.ownerId = 0;
  }

  chooseMemberModal = false;
  chooseMemberData: any;

  assignOwnerFn() {
    this.searchMemberData = {
      page: '1', // 页码
      rows: '10', // 每页条数
      deptId: null, // 一级部门ID
      subdeptId: null, // 二级部门ID
      threedeptId: null, // 三级部门ID
      position: '', // 职务
      searchStr: '' // 查询条件
    };
    this.chooseMemberModal = true;
    this.getChooseMember();
    this.getQueryPositions();
    this.getChooseLevelContact(this.ENTID, 'one');
  }

  //查询授权列表参数
  searchMemberData: any = {
    page: '1',//页码
    rows: '10',//每页条数
    deptId: null,//一级部门ID
    subdeptId: null,//二级部门ID
    threedeptId: null,//三级部门ID
    position: '',//职务
    searchStr: ''//查询条件
  };

  getChooseMember() {
    this.entRoomService.getChooseMember(this.searchMemberData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.chooseMemberData = resultData.data;
        }
      },
      err => {
        console.log(err);
      });
  }

  // 确定更换授权人员
  chooseBtn_ok() {
    this.chooseMemberModal = false;
    this.checkedMember.realName = this.selectMember.realName;
    this.ownerId = this.selectMember.userId;
  }

  selectMember: any;

  chooseFn($event, member: any) {
    this.selectMember = member;
  }


  /* 选择联系人 选择一级部门 */
  oneDepartmentList: any = [];  // 一级部门数据列表
  deptName: any = '';   // 已选择的一级部门
  deptId: number; // 一级部门ID
  getChooseLevelContact(paramId: any, deptType: any) {
    this.entRoomService.getChooseLevelContact(paramId).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          if (deptType === 'one') {
            this.oneDepartmentList = datalist.data;
          } else if (deptType === 'two') {
            this.TwoDepartmentList = datalist.data;
          } else if (deptType === 'three') {
            this.ThreeDepartmentList = datalist.data;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 一级部门选择 change事件 查询二级部门 */
  TwoDepartmentList: any = [];  //二级部门列表
  subdeptName: any = '';  //已选择的二级部门
  subdeptId: number; //二级部门ID
  getSecondDepat(item: any) {
    if (item !== '') {
      this.searchMemberData.deptId = item;
      this.searchMemberData.subdeptId = null;
      this.searchMemberData.threedeptId = null;
      this.subdeptName = '';
      this.threedeptName = '';
      this.getChooseMember();
      this.getChooseLevelContact(item, 'two');
    } else {
      this.searchMemberData.deptId = null;
      this.searchMemberData.subdeptId = null;
      this.searchMemberData.threedeptId = null;
      this.deptName = '';
      this.subdeptName = '';
      this.threedeptName = '';
      this.getChooseMember();
      this.TwoDepartmentList = [];
      this.ThreeDepartmentList = [];
    }

  }

  /* 二级部门change事件 查询三级部门 */
  ThreeDepartmentList: any = []; //三级部门列表
  threedeptName: any = '';   //已选择的三级部门
  threedeptId: number;  //三级部门ID
  getThirdDepat(item) {
    if (item !== '') {
      this.searchMemberData.subdeptId = item;
      this.searchMemberData.threedeptId = null;
      this.searchMemberData.threedeptName = null;
      this.getChooseMember();
      this.getChooseLevelContact(item, 'three');
    } else {
      this.searchMemberData.threedeptId = null;
      this.searchMemberData.threedeptName = null;
      this.searchMemberData.subdeptId = null;
      this.subdeptName = '';
      this.threedeptName = '';
      this.getChooseMember();
      this.ThreeDepartmentList = [];
    }

  }

  /*选择三级部门 change 事件*/
  searchUser(item) {
    if (item !== '') {
      this.searchMemberData.threedeptId = item;
      this.getChooseMember();
    } else {
      this.threedeptName = '';
      this.searchMemberData.threedeptId = null;
      this.getChooseMember();
    }
  }

  /* 查询职位 */
  positionsList: any = [];
  position: any = '';

  getQueryPositions() {
    this.entRoomService.getQueryPositions().subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.positionsList = datalist.data;
        }
      },
      err => {
        console.log(err);
      });
  }

  /* 选择职务 change事件 */
  searchPositions(item: any) {
    this.searchMemberData.position = item;
    this.getChooseMember();
  }

  /* 姓名 工号 Key 搜搜 */
  realName: any = '';

  searchRealName(item) {
    this.searchMemberData.searchStr = item;
    this.getChooseMember();
  }


}
