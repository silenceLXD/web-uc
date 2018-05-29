import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';
import {NzModalService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';
import {NgForm} from '@angular/forms';
import {EntContactsService} from '../ent-contacts.service';
import {AuthService} from '@services/auth.service';

@Component({
  selector: 'app-ent-contacts',
  templateUrl: './ent-contacts.component.html',
  styleUrls: ['./ent-contacts.component.css']
})
export class EntContactsComponent implements OnInit, AfterViewInit, OnDestroy {
  // 是否可用
  isAvailableOne: boolean;
  public loginUserData = this.commonService.getLoginMsg();
  ENTID: any = this.loginUserData.entId;
  USERID: any = this.loginUserData.userId;
  emailUsed: any = false;
  phoneUsed: any = false;
  sipalert = true;
  emailUsedList: any;
  phoneUsedList: any;
  isDisabledButton = true;
  isEditFormDisabledButton = true;
  isOtherDeptFormDisabledButton = true;
  isFirstDepatFormDisabledButton = true;
  unAddUserForm: any;
  unEditForm: any;
  unOtherDeptForm: any;
  unFirstDepatForm: any;
  oldMobilePhone: any; // 编辑用户前手机号
  oldEmail: any; // 编辑用户前邮箱

  /* 异步手机号和邮箱 */
  asyncValidtorBool = {
    isDisabledButton: null, // 判断重复禁用保存
    emailRepeat: false, // 判断邮件是否重复
    mobilePhoneRepeat: false // 判断手机号是否重复
  };

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private entContactsService: EntContactsService,
              private authService: AuthService,
              private confirmServ: NzModalService,
              private _notification: NzNotificationService) {
  }

  @ViewChild('addUserForm') addUserForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  @ViewChild('otherDeptForm') otherDeptForm: NgForm;
  @ViewChild('firstDepatForm') firstDepatForm: NgForm;
  searchByName: any = ''; // 通过姓名查找通讯录用户
  position: any = ''; // 职务
  // 左侧 组织列表数据
  organList: any = {
    userName: '', // 名称
    count: 0,  // 总人数
    value: '', // 组织Id
    level: 0, // 组织级别
    submenu: [] // list
  };

  ngOnInit() {
    this.isAvailableOne = this.commonService.getAvailableThree();
    this.getOrganizationList();
    this.getSipCount();
    // this.getSipRemaining();
    this.getEntPosition();

  }

  setClickOrganizationList() {
    this.getOrganizationList()
      .add(() => this.searchAll(this.organList.value, this.organList.level, this.organList.name));
  }

  ngAfterViewInit(): void {
    // 订阅表单值改变事件
    this.unAddUserForm = this.addUserForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onValueChanged(data);
      });
    this.unEditForm = this.editForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onEditFormValueChanged(data);
      });
    this.unOtherDeptForm = this.otherDeptForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onOtherDeptFormValueChanged(data);
      });
    this.unFirstDepatForm = this.firstDepatForm.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        this.onFirstDepatFormValueChanged(data);
      });
  }

  ngOnDestroy() {
    this.unAddUserForm.unsubscribe();
    this.unEditForm.unsubscribe();
    this.unOtherDeptForm.unsubscribe();
    this.unFirstDepatForm.unsubscribe();
  }

  // 初始化异步手机和邮箱验证
  setAsyncValidtorBool() {
    this.asyncValidtorBool.isDisabledButton = null;
    this.asyncValidtorBool.emailRepeat = false;
    this.asyncValidtorBool.mobilePhoneRepeat = false;
  }

  onValueChanged(data) {
    this.isDisabledButton = this.addUserForm.valid;
    if (this.addUserForm.controls.email) {
      if (!this.addUserForm.controls.email.errors) {  // 验证邮件表单选项唯一
        this.getEmailRepeat(data.email);
      }
    }
    if (this.addUserForm.controls.mobilePhone) {
      if (!this.addUserForm.controls.mobilePhone.errors) {  // 验证手机表单选项唯一
        this.getMobilePhoneRepeat(data.mobilePhone);
      }
    }
  }

  onEditFormValueChanged(data) {
    this.isEditFormDisabledButton = this.editForm.valid;
    if (this.editForm.controls.email && data.email !== this.oldEmail) {
      if (!this.editForm.controls.email.errors) {  // 验证邮件表单选项唯一
        this.getEmailRepeat(data.email);
      }
    } else if (data.email === this.oldEmail) {
      this.asyncValidtorBool.emailRepeat = false;
      this.setDisabledButton();
    }
    if (this.editForm.controls.mobilePhone && data.mobilePhone !== this.oldMobilePhone) {
      if (!this.editForm.controls.mobilePhone.errors) {  // 验证手机表单选项唯一
        this.getMobilePhoneRepeat(data.mobilePhone);
      }
    } else if (data.mobilePhone === this.oldMobilePhone) {
      this.asyncValidtorBool.mobilePhoneRepeat = false;
      this.setDisabledButton();
    }
  }

  onOtherDeptFormValueChanged(data) {
    this.isOtherDeptFormDisabledButton = this.otherDeptForm.valid;
  }

  onFirstDepatFormValueChanged(data) {
    this.isFirstDepatFormDisabledButton = this.firstDepatForm.valid;
  }

  /***************** 初始化 获取数据  *******************/
  // 查询获取 组织列表
  getOrganizationList() {
    return this.entContactsService.getCustomizeEntList(this.ENTID, this.searchByName).subscribe(
      res => {
        const dataList: any = res;
        this.organList = dataList.data;
        this.itemName = dataList.data.name; //初始化显示企业名称
        // 根据组织ID查询通讯录用户
        this.getOrganUser(); //查询所有
      },
      err => {
        console.log(err);
      }
    );
  }

  userListData: any = {
    list: [],
    totalPages: 0,
    currentPage: 1
  };
  // 根据组织ID查询数据
  getUserData = {
    pageNum: '1',//页码
    pageSize: '10',//每页条数
    searchInput: this.searchByName,//查询条件
    position: this.position//职务
  };

  // 组织id查询通讯录用户(orgLevel:0表示entId是公司，1表示entId是一级部门，2表示entId是2级部门，3表示entId是3级部门)
  getOrganUser() {
    // let getData = this.commonService.formObject(this.getUserData);
    return this.entContactsService.applyTemplateFn(this.orgId, this.orgLevel, this.getUserData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          if (resultData.data.list.length > 0) {
            this.userListData = {
              list: resultData.data.list,
              totalPages: resultData.data.total,
              currentPage: resultData.data.pageNum
            };
          } else {
            this.userListData = {
              list: [],
              totalPages: 0,
              currentPage: 1
            };
          }
        }

      },
      err => {
        console.log(err);
      });
  }

  //分页
  pageChanged(pagenum: any) {
    this.getUserData.pageNum = pagenum;
    this.userListData.currentPage = pagenum;
    this.getOrganUser();
  }

  positionList: any;

  getEntPosition() {
    return this.entContactsService.getEntPosition().subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.positionList = resultData.data;
        }
      },
      err => {
        console.log(err);
      });
  }

// 查询企业的最大sip数量
  sipCount: any = 0;

  getSipCount() {
    this.entContactsService.getSipCount().subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.sipCount = resultData.data.sipCount;
        } else {
          this.sipCount = 0;
        }
      },
      err => {
        console.log(err);
      });
  }

  // 查询企业剩余多少账号数
  sipRemaining: any = 0;

  getSipRemaining() {
    this.entContactsService.getSipRemaining().subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.sipRemaining = resultData.data;
        } else {
          this.sipRemaining = 0;
        }
      },
      err => {
        console.log(err);
      });
  }

  /*************** 公司部门层级数结构 操作 start*********************/
  itemName: any = ''; //右侧所属部门（默认显示公司名称）
  orgLevel: any = 0;//查询部门等级默认为全部 0
  orgId: any = this.ENTID;//查询部门id

  isShowUpdateBtn = false;//是否显示操作按钮（添加子部门，添加用户，删除用户）
  isCanDelet = true;//是否disabled（删除部门）按钮

  // 点击获取组件数据
  getTreeItemData(val: any) {
    this.assignment(val);
    this.isShowUpdateBtn = true;//显示部门可操作按钮
    this.isCanDelet = val.count <= 0; //如果存在用户则不能点击
  }

  // 赋值
  assignment(item: any) {
    this.itemName = item.name;  //部门名称
    this.orgLevel = item.level; //部门等级
    this.orgId = item.value;  //部门id

    this.addUserData.orgLevel = item.level; //部门等级
    this.addUserData.parentOrgId = item.value;  //部门id
    this.getOrganUser();
  }

  // 检索通讯录用户 查看全部
  positionSearch: any = '';

  searchData() {
    this.getUserData.searchInput = this.searchByName;
    this.getUserData.position = this.positionSearch;
    this.getOrganUser();
  }

  searchAll(id, level, name) {
    this.orgLevel = level;
    this.orgId = id;
    this.itemName = name;
    this.isShowUpdateBtn = false;//不显示部门可操作按钮
    this.getOrganUser();
  }

  /******* 编辑部门名称 *******/
  isEditOrgpName = false;

  editOrgName() {
    const postData = {
      orgName: this.itemName, //部门名称
      departmentalLevel: this.addUserData.orgLevel //部门等级
    };
    this.entContactsService.editOrgName(this.orgId, postData).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this._notification.create('success', '修改成功', '');
          this.isEditOrgpName = !this.isEditOrgpName;
          this.getOrganUser();
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '修改失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  updateName: any;

  sureEdit() {
    this.updateName = this.itemName;
  }

  cancelEditOrgName() {
    this.itemName = this.updateName;
  }

  // 回车确认修改
  editOrgNameKey(e) {
    if (e.keyCode === 13) {
      this.editOrgName();
    }
  }

  /***** 添加部门分公司 *****/
  depatName: any;// 添加部门分公司名称
  AddDepartmentBranchModal: boolean = false;

  // 点击添加部门/分公司
  AddDepartmentBranch() {
    this.AddDepartmentBranchModal = true;
    this.depatName = '';
  }

  saveBtn_ok() {
    const getData = {
      'orgName': this.depatName
    };

    this.entContactsService.saveBtn_ok(this.orgLevel, this.organList.value, getData).subscribe(
      res => {
        const resultData: any = res;
        this.AddDepartmentBranchModal = false;
        this.getOrganUser();
        if (+resultData.code === 200) {
          this._notification.create('success', '添加成功', '');
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '添加失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }


  /***** 添加子部门 *****/
  addOtherDepatModal: boolean = false;
  otherdepatName: any = '';

  // 点击添加子部门
  addOtherDepateFn() {
    this.otherdepatName = '';
    this.addOtherDepatModal = true;
  }

  saveAddOtherFn() {
    const getData = {
      orgName: this.otherdepatName
    };
    this.entContactsService.saveAddOtherFn(this.orgLevel, this.addUserData.parentOrgId, getData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '添加成功', '');
          this.addOtherDepatModal = false;
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '添加失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  /***** 删除部门 ****/
  deletDepatFn = () => {
    this.confirmServ.confirm({
      title: '删除',
      content: '是否确认删除当前部门？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.sureDeleteDepatFn();
      },
      onCancel() {
      }
    });
  }

  // 确定删除部门
  sureDeleteDepatFn() {
    this.entContactsService.sureDeleteDepatFn(this.addUserData.parentOrgId).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '删除成功', '');
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '删除失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  /************************* 公司部门 操作end ************************************/


  /************************* 用户user操作 start ************************************/
  /***** 添加用户 *****/
  addUserModal = false;

  addUserFn() {
    const objArr = ['itemName', 'roleId'];
    for (const key in this.addUserForm.controls) {
      if (objArr.indexOf(key) === -1) {
        this.addUserForm.controls[key].reset();
      }
    }
    this.getSipRemaining();
    // 提交数据字段
    this.addUserData = {
      empno: '',  // 工号
      realName: '', //姓名
      // itemName: this.itemName,  //所属部门
      orgLevel: '',  //部门等级
      parentOrgId: '',  //用户所在部门ID
      position: '', //职务
      email: '',  //邮箱
      mobilePhone: '', // 手机
      roleId: 3  //角色
    };
    setTimeout(() => {
      if (this.sipRemaining <= 0) {
        this._notification.create('error', '通讯录账号数已达上限,不能添加用户', '');
      } else {
        this.addUserModal = true;
      }
    }, 200);

  }

  // 提交数据字段
  addUserData: any = {
    empno: '',  // 工号
    realName: '', //姓名
    // itemName : '',  //所属部门
    orgLevel: '',  //部门等级
    parentOrgId: '',  //用户所在部门ID
    position: '', //职务
    email: '',  //邮箱
    mobilePhone: '', // 手机
    roleId: ''  //角色
  };

  // 提交表单
  saveAddUserFn() {
    this.addUserData.orgLevel = this.orgLevel;
    this.addUserData.parentOrgId = this.orgId;
    this.entContactsService.saveAddUserFn(this.addUserData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '添加成功', '');
          this.addUserModal = false;
          this.setClickOrganizationList();
          this.getEntPosition();
        } else if (+resultData.code === 32610) {
          // this.DidNotBuyServiceNoUser();
          this._notification.create('error', '通讯录账号数已达上限,不能添加用户', '');
        } else if (+resultData.code === 32617) {
          this._notification.create('error', '未购买服务,不能添加用户', '');
        } else {
          this._notification.create('error', '添加失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  /* 未购买服务 不能添加用户 */
  // DidNotBuyServiceNoUser = () => {
  //   this.confirmServ.confirm({
  //     title: '消息',
  //     content: '未购买服务 不能添加用户',
  //     okText: '确定',
  //     cancelText: '取消'
  //   });
  // }


  /****** 编辑用户 *********/
  updateUserModal = false;
  updateUserData: any = {
    empno: '',
    userName: '',
    position: '',
    email: '',
    mobilePhone: '',
    roleId: '',
    deptId: '',
    subdeptId: '',
    threedeptId: '',
  };

  //編輯
  updateUserFn(user: any) {
    this.updateUserModal = true;
    this.updateUserData = user;
    this.oldMobilePhone = this.updateUserData.mobilePhone;
    this.oldEmail = this.updateUserData.email;
    this.setAsyncValidtorBool();
    this.getFirstDepat(this.ENTID);
    if (+user.deptId === 0) {
      this.updateUserData.deptId = '';
    }
    this.getSecondDepat(user.deptId);
    this.getThirdDepat(user.subdeptId);
  }

  cancelUpdateUserFn() {
    this.setClickOrganizationList();
    this.updateUserModal = false;
  }

  sureUpdateUserFn(userId: any) {
    this.entContactsService.sureUpdateUserFn(userId, this.updateUserData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '修改成功', '');
          this.updateUserModal = false;
          this.getEntPosition()
            .add(() => {
              this.setClickOrganizationList();
            });
        } else {
          this._notification.create('error', '修改失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }


  /****** 删除用户 *********/
  deleteUserFn = (userId: any) => {
    this.confirmServ.confirm({
      title: '删除',
      content: '是否确认删除用户？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.sureDeleteUserFn(userId);
      },
      onCancel() {
      }
    });
  }

  sureDeleteUserFn(userId: any) {
    this.entContactsService.sureDeleteUserFn(userId).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '删除成功', '');
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '删除失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }


  /****** 重置用户密码 *********/
  restPwdUserData: any = {
    userId: 0,
    newPassword: '123456',
    repeatPassword: '123456'
  };
  restPwd = (userId: any) => {
    this.confirmServ.confirm({
      title: '重置密码',
      content: '是否将登陆密码重置为123456',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.sureRestPwdFn(userId);
      },
      onCancel() {
      }
    });
  }

  sureRestPwdFn(userId: any) {
    this.restPwdUserData.userId = userId;
    this.entContactsService.sureRestPwdFn(this.restPwdUserData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this._notification.create('success', '密码重置成功', '');
          this.setClickOrganizationList();
        } else {
          this._notification.create('error', '密码重置失败', '');
        }
      },
      err => {
        console.log(err);
      });
  }

  /************************* 用户user操作 end ************************************/

  /***** 导入通讯录 *****/
  isImport = false; //判断是否导入通讯录  true为 导入
  showRepeatDataModal = false;
  ImportList: any;  //第一步导入 可以导入的数据列表
  ImportListLength: any = 0; //显示导入总条数
  openImprotFileModal = false;
  excelFile: any = ''; // 选择文件名
  openImprotFile() {
    this.getSipRemaining();
    setTimeout(() => {
      if (this.sipRemaining <= 0) {
        this._notification.create('error', '通讯录账号数已达上限,不能添加用户', '');
      } else {
        this.openImprotFileModal = true;
        if (this.file) {
          this.fileName = this.file.name;
        } else {
          this.fileName = '';
        }
      }
    }, 200);

  }

  // 下载通讯录模板
  downloadBookTemplate() {
    const url = this.entContactsService.downloadBookTemplate(this.USERID);
    this.commonService.downloadExport(url, 'userBookTemplate');
  }

  file: any; //选择的文件
  fileName: any = ''; //选择的文件名
  previewImage(value: any) {
    this.file = value.target.files[0];
    if (this.file) {
      this.fileName = this.file.name;
    } else {
      this.fileName = '';
    }
  }

  // 上传导入文件
  uploadBtn_ok(flag: any) {
    const formData = new FormData();
    formData.append('file', this.file);
    // 导入通讯录第一步
    this.entContactsService.uploadBtn_ok(flag, formData).subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.data === 2) {
          // 第一步导入提示
          this.openImprotFileModal = false;
          this.ImportSecond();
          //the upload file is empty
        } else if (datalist.code == 32607) {
          this.openImprotFileModal = false;
          this.fileIsEmpty();
          //the enterprise not buy service
        } else if (datalist.code == 32617) {
          this.openImprotFileModal = false;
          this.DidNotBuyService();
          //sip resource transfinite
        } else if (datalist.code == 32610) {
          this.openImprotFileModal = false;
          this.SipServiceTransfiniteService();
          //the file type error
        } else if (datalist.code == 32609) {
          this.openImprotFileModal = false;
          this.fileTypeError();
          //the upload file content error
        } else if (datalist.data == 1000) {
          this.openImprotFileModal = false;
          this.fileContentError();
          //upload file content is empty
        } else if (datalist.data.totalRows == 0) {
          this.openImprotFileModal = false;
          this.fileContentIsNull();
        } else {
          this.openImprotFileModal = false;
          this.ImportList = datalist.data.list;
          this.ImportListLength = datalist.data.totalRows;
          if (this.ImportListLength < 0) {
            this.ImportListLength = 0;
          }
          this.saveImportSecond();

        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 导入第二步 */
  saveImportSecond() {
    // 导入通讯录第二步
    this.entContactsService.saveImportSecond().subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          var emailData = datalist.data.userListByEmail;
          var phoneData = datalist.data.userListByPhone;
          this.emailUsed = !(emailData == null || emailData.length == 0);
          this.emailUsedList = emailData;
          this.phoneUsed = !(phoneData == null || phoneData.length == 0);
          this.phoneUsedList = phoneData;
          if (this.phoneUsed == false && this.emailUsed == false) {
            this.isImport = true;
            this.showRepeatDataModal = false;
          } else {
            this.isImport = true;
            this.showRepeatDataModal = true;
          }
        } else if (datalist.code == 32609) {
          this.fileIsHaveNullValue();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /* 确定导入 -- 导入第三步 */
  insertUser() {
    this.entContactsService.insertUser().subscribe(
      res => {
        const datalist: any = res;
        if (+datalist.code === 200) {
          this.isImport = false;
          this.getOrganUser();
          this.getEntPosition();
          this.setClickOrganizationList();
          this._notification.create('success', '导入成功', '');
        } else {
          this.isImport = false;
          this._notification.create('error', '导入失败', '');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // 第一步导入提示
  ImportSecond = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '您要导入的文件sheet名称与您所在单位不符，是否继续导入？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await this.uploadBtn_ok('1');
      },
      onCancel() {
      }
    });
  };
  /* 提示为购买服务 */
  DidNotBuyService = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '未购买服务，不能导入通讯录',
      okText: '确定',
      cancelText: '取消'
    });
  };

  /* sip资源超限 */
  SipServiceTransfiniteService() {
    this.confirmServ.confirm({
      title: '消息',
      content: '通讯录账号数已达上限，不能导入通讯录',
      okText: '确定',
      cancelText: '取消'
    });
  }


  /* Excel为空 */
  fileIsEmpty = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: 'Excel为空',
      okText: '确定',
      cancelText: '取消'
    });
  };
  /* 文件格式的错误 */
  fileTypeError = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '文件格式错误',
      okText: '确定',
      cancelText: '取消'
    });
  };

  /* 文件内容的错误 */
  fileContentError = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '文件格式不正确，请检查你要导入的文件是否正确',
      okText: '确定',
      cancelText: '取消'
    });
  };

  /* 文件内容为空*/
  fileContentIsNull = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '文件信息为空',
      okText: '确定',
      cancelText: '取消'
    });
  };

  /* 必填内容有空值*/
  fileIsHaveNullValue = () => {
    this.confirmServ.confirm({
      title: '消息',
      content: '文件格式错误或必填为空，无法导入，请补全内容后重试。',
      okText: '确定',
      cancelText: '取消'
    });
  };

  /* 返回导入 */
  back() {
    this.isImport = false;
  }

  /***** 导出通讯录 *****/
  exportBook() {
    const url = this.entContactsService.exportBook(this.USERID);
    this.commonService.downloadExport(url, this.organList.name);
  }

  /**** 获取部门数据 **/

  /** 根据entid 获取一级部门数据 */
  firstDeptData: any;

  getFirstDepat(id: any) {
    this.entContactsService.getFirstDepat(id).subscribe(
      res => {
        const resultData: any = res;
        this.firstDeptData = resultData.data;
      },
      err => {
        console.log(err);
      });
  }

  /** 根据entid 获取二级部门数据 */
  secondDeptData: any;

  getSecondDepat(id: any) {
    this.entContactsService.getSecondDepat(id).subscribe(
      res => {
        const resultData: any = res;
        this.secondDeptData = resultData.data;
      },
      err => {
        console.log(err);
      });
  }

  /** 根据entid 获取三级部门数据 */
  thirdDepatData: any;

  getThirdDepat(id: any) {
    this.entContactsService.getThirdDepat(id).subscribe(
      res => {
        const resultData: any = res;
        this.thirdDepatData = resultData.data;
      },
      err => {
        console.log(err);
      });
  }

  //获取部门数据
  deptData: any;

  getDepatFn(parentId: any) {
    this.entContactsService.getDepatFn(parentId).subscribe(
      res => {
        const resultData: any = res;
        this.deptData = resultData.data;
        return resultData.data;
      },
      err => {
        console.log(err);
      });
  }

  /**************验证器***************/

  // 企业名称或邮箱或手机号重复时对保存的禁用
  setDisabledButton() {
    this.asyncValidtorBool.isDisabledButton = this.asyncValidtorBool.emailRepeat || this.asyncValidtorBool.mobilePhoneRepeat;
  }

  // 邮箱重复验证
  getEmailRepeat(value) {
    this.authService.validationEmail(value).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.asyncValidtorBool.emailRepeat = false;
          this.setDisabledButton();
        } else {
          this.asyncValidtorBool.emailRepeat = true;
          this.setDisabledButton();
        }
      },
      err => {
        console.log(err);
      });
  }

  // 手机重复验证
  getMobilePhoneRepeat(value) {
    this.authService.validationPhoneAdd(value).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.asyncValidtorBool.mobilePhoneRepeat = false;
          this.setDisabledButton();
        } else {
          this.asyncValidtorBool.mobilePhoneRepeat = true;
          this.setDisabledButton();
        }
      },
      err => {
        console.log(err);
      });
  }
}
