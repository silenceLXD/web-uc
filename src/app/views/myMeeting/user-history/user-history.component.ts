import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {UserHistoryService} from '../user-history.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {

  // 用户角色
  roleId: any;
  // 是否可用
  isAvailableOne: boolean;
  public loginUserData = this.commonService.getLoginMsg();
  ENTID = this.loginUserData.entId; // loginUserData.entId

  searchData: any;
  _startDate: any;
  sevenDays: any;
  _endDate = new Date();

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private commonService: CommonService,
              private userHistoryService: UserHistoryService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
    this.sevenDays = new Date(this._endDate);
    this.sevenDays.setDate(this._endDate.getDate() - 7);
    this._startDate = this.sevenDays;
    //查询数据数初始化
    this.searchData = {
      startTime: this.commonService.formatDate(this._startDate) + ' 00:00:00', //查询开始时间
      endTime: this.commonService.formatDate(this._endDate) + ' 00:00:00', //查询结束时间
      pageNum: '1', //第几页
      pageSize: '10',  //每页多少条
      keywords: ''//会议名称
    };
  }

  /******* 日期选择器 start ******/
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
    this.searchData.startTime = this.commonService.formatDate(this._startDate);
    this.dataSearchFn();
  };
  _endValueChange = () => {
    this.searchData.endTime = this.commonService.formatDate(this._endDate);
    if (new Date(this.commonService.formatDate(this._startDate) + ' 00:00:00') > this._endDate) {
      this._startDate = null;
    }
    this.dataSearchFn();
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue && startValue.getTime() > Date.now();
    // return startValue.getTime() >= this._endDate.getTime();
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue && endValue.getTime() > Date.now();
    // return endValue.getTime() <= this._startDate.getTime();
  };
  /****** 日期选择器 end ******/

  /******************** 初始化声明 ******************/
    // =======表格显示数据
  public tableData: any = {//表格数据
    list: [],
    totalPages: 0,
    currentPage: 1
  };

  ngOnInit() {
    this.roleId = this.commonService.getLoginMsg().roleType;
    this.isAvailableOne = this.commonService.getAvailableOne();
    this.getTableDataFn(); //页面加载 渲染表格
  }

  /* 表格列表数据初始化 */
  getTableDataFn() {
    // let getData = this.commonService.formObject(this.searchData);
    return this.userHistoryService.getTableDataFn(this.searchData).subscribe(
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
    this.tableData.currentPage = pagenum;
    this.getTableDataFn();
  }

  //查询
  dataSearchFn() {
    this.getTableDataFn();
  }

  /************** 初始化 end ****************/

}
