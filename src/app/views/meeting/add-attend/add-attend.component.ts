import {Component, OnInit, EventEmitter, Input, Output, ViewChild, AfterViewInit, ElementRef, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@services/common.service';
// import {TreeviewComponent, TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {Subject} from 'rxjs/Subject';
import {TreeviewItem} from '../../plugins/treelib/treeview-item';
import {TreeviewComponent} from '../../plugins/treelib/treeview.component';
import {NgForm} from '@angular/forms';
import {AddAttendService} from '../add-attend.service';

@Component({
  selector: 'add-attend',
  templateUrl: './add-attend.component.html',
  styleUrls: ['./add-attend.component.css'],
})
export class AddAttendComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() outPutAttendData: EventEmitter<any> = new EventEmitter(); // 子传父
  @Output() hide_emitter = new EventEmitter(); //  发射隐藏modal的事件

  @Input() commonId: any; // 父传子  获取来自父组件的cid
  @Input() addAttendModal: boolean;  // 父传子  获取来自父组件的modal
  @Input() modalType: any;  // 父传子  判断用于什么场景 1:预约邀请；2:会控邀请

  public loginUserData = this.commonService.getLoginMsg();
  ENTID = this.loginUserData.entId; // loginUserData.entId
  isActiveTab = 1;
  searchByName = '';
  searchByUserName = '';
  searchByRoomName = '';
  // tree
  config: any;
  items: TreeviewItem[] = [];
  treeviewOneDomInputs: any;
  treeviewTwoDomInputs: any;
  itemsTwo: TreeviewItem[] = [];
  isTreeview = false;
  isTreeviewTwo = false;

  // 左侧公司全部人员数据
  theUserListData: any = [];

  // 获取会议室数据
  theRoomListData: any = [];

  userList: any = []; // 参会者数组
  roomList: any = []; // 会议室数组

  allUserListData: any = []; // 所有参会者列表
  allUserIdListData: any = []; // 所有参会者Id列表
  userListData: any = []; // 渲染参会者
  roomListData: any = []; // 渲染参会者

  checkedLength: number = 0; // 已选人数

  attendListData: any = [];

  unOneSelectedChange: any;
  unQueryForm: any;

  constructor(private http: HttpClient,
              private _notification: NzNotificationService,
              private commonService: CommonService,
              private addAttendService: AddAttendService) {
  }

  onOneSelectedChange: Subject<any> = new Subject<any>();
  @ViewChild('treeview') treeview: TreeviewComponent;
  @ViewChild('treeviewTwo') treeviewTwo: TreeviewComponent;
  @ViewChild('treeviewRef') treeviewRef: ElementRef;
  @ViewChild('queryForm') queryForm: NgForm;

  ngOnInit() {
    this.loadUserData().add(() => {
      this.isTreeview = true;
      setTimeout(() => {
        this.treeviewOneInit();
        this.treeviewOneDomInputs[0].click();
        if (this.treeviewOneDomInputs[0].checked) {
          this.treeviewOneDomInputs[0].click();
        }
      });
      if (this.theUserListData[1]) {
        this.isTreeviewTwo = true;
        setTimeout(() => {
          this.treeviewTwoInit();
        });
      }
    });
    this.loadRoomData();
    // tree config
    this.config = {
      hasAllCheckBox: false,
      hasFilter: false,
      hasCollapseExpand: false,
      decoupleChildFromParent: false,
      maxHeight: 'auto'
    };

    this.unOneSelectedChange = this.onOneSelectedChange.subscribe(arr => {
      this.userListData = [];
      this.allUserListData.forEach(obj => {
        if (arr.indexOf(obj.userId) !== -1) {
          this.userListData.push(obj);
        }
      });
      this.setTreeUserFn(this.userListData);
    });

  }

  ngAfterViewInit() {
    this.unQueryForm = this.queryForm.valueChanges
      .debounceTime(500)
      .subscribe((data) => {
        this.searchUserFn(data.search);
      });
  }

  ngOnDestroy() {
    this.unOneSelectedChange.unsubscribe();
    this.unQueryForm.unsubscribe();
  }


  /** tree start **/
  // 初始化treeviewOne 列表
  treeviewOneInit() {
    const treeviewOneDom = this.treeviewRef.nativeElement.getElementsByTagName('ngx-treeview')[0];
    this.treeviewOneDomInputs = treeviewOneDom.getElementsByClassName('form-check-input');
    this.getChildItemUserIds(this.theUserListData[0]);
  }

  treeviewTwoInit() {
    const treeviewOneDom = this.treeviewRef.nativeElement.getElementsByTagName('ngx-treeview')[1];
    this.treeviewTwoDomInputs = treeviewOneDom.getElementsByClassName('form-check-input');
  }

  // 点击treeviewOne input
  treeviewOneClick(user) {
    for (let i = 0; i < this.treeviewOneDomInputs.length; i++) {
      if (+this.treeviewOneDomInputs[i].dataset.id === user.userId) {
        this.treeviewOneDomInputs[i].click();
      }
    }
  }

  //  tree  查找 用户查找
  searchUserFn(value) {
    this.treeview.onFilterTextChange(value);
    if (this.treeviewTwo) {
      this.treeviewTwo.onFilterTextChange(value);
    }
  }

  // tree 列表数据
  setTreeUserFn(arr) {
    const userListUserIdData = [];
    arr.forEach(item => {
      userListUserIdData.push(item.userId);
    });
    if (this.treeview) {
      const allTreeviewItems = this.treeview.selection.checkedItems.concat(this.treeview.selection.uncheckedItems);
      allTreeviewItems.forEach(item => {
        if (userListUserIdData.indexOf(+item.userId) === -1) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      });
    }
    if (this.isTreeviewTwo && this.treeviewTwo) {
      const allTreeviewItemsTwo = this.treeviewTwo.selection.checkedItems.concat(this.treeviewTwo.selection.uncheckedItems);
      const arrLength = [];
      allTreeviewItemsTwo.forEach(item => {
        if (userListUserIdData.indexOf(+item.userId) === -1) {
          item.checked = false;
          arrLength.push(false);
        } else {
          item.checked = true;
        }
      });
      if (this.treeviewTwo.filterItems[0]) {
        if (allTreeviewItemsTwo.length === arrLength.length) {
          this.treeviewTwo.filterItems[0].checked = false;
        } else if (+arrLength.length === 0) {
          this.treeviewTwo.filterItems[0].checked = true;
        } else {
          this.treeviewTwo.filterItems[0].checked = false;
        }
      }
    }
    this.userListData = [];
    setTimeout(() => {
      this.userListData = arr;
    });
  }

  // 会议室列表数据
  setRoomListFn(arr) {
    const roomListUserIdData = [];
    arr.forEach(item => {
      roomListUserIdData.push(item.userId);
    });
    this.theRoomListData.forEach(item => {
      if (roomListUserIdData.indexOf(+item.userId) === -1) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });
    this.roomListData = [];
    this.roomListData = arr;
  }

  // 定义一个subject 事件

  // tree 的抛出事件
  onSelectedChange(arr) {
    this.onOneSelectedChange.next(arr);
  }

  // treeTwo 的抛出事件
  onSelectedChangeTwo(arr) {
    if (this.treeviewTwo) {
      const uncheckedArr = [];
      this.treeviewTwo.selection.uncheckedItems.forEach((item) => {
        uncheckedArr.push(item.userId);
      });
      for (let i = 0; i < this.treeviewOneDomInputs.length; i++) {
        if (arr.indexOf(+this.treeviewOneDomInputs[i].dataset.id) !== -1 && !this.treeviewOneDomInputs[i].checked) {
          this.treeviewOneDomInputs[i].click();
        } else if (uncheckedArr.indexOf(+this.treeviewOneDomInputs[i].dataset.id) !== -1 && this.treeviewOneDomInputs[i].checked) {
          this.treeviewOneDomInputs[i].click();
        }
      }
    }
  }

  /** tree end **/
  loadUserData() {
    //  param: methodFlag 方法标识。
    // 1：发起会议菜单数据格式。2：会议议程数据格式。（选中已在会议中的人）3：预约邀请参会人数据格式。会控（踢掉已在会中的人） 	 * 4：从群组发起会议。5：从历史会议查询会议。  默认查询（1）的发起会议。没有任何ischecked
    const getData: any = {'search': this.searchByName, 'commonId': this.commonId};
    return this.addAttendService.loadUserData(getData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.theUserListData = resultData.data;
          this.items.push(new TreeviewItem(this.theUserListData[0]));
          if (this.theUserListData[1]) {
            this.itemsTwo.push(new TreeviewItem(this.theUserListData[1]));
          }
          // 数据平铺
          const result = this.theUserListData[0];
          result.checked = true;
          this.allUserListData = this.getAllCheckedItem(result);
        } else {
        }
      },
      err => {
        console.log('获取公司人员数据 error...');
      });
  }

  //  roomListData:any = [];
  loadRoomData() {
    const getData: any = {'queryStr': this.searchByName, 'pageNum': '-1', 'pageSize': '-1'};
    this.addAttendService.loadRoomData(this.ENTID, getData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.theRoomListData = resultData.data;
        } else {
        }
      },
      err => {
        console.log('获取会议室数据 error...');
      });
  }

  /* 选择人员  选择会议室操作 */

  //  获取userId 列表平铺
  getChildItemUserIds(childItem) {
    childItem.children.forEach((item) => {
      if (this.hasChildItems(item)) {
        if (item.userId) {
          this.allUserIdListData.push(item.userId);
        }
        this.getChildItemUserIds(item);
      } else {
        if (item.userId) {
          this.allUserIdListData.push(item.userId);
        }
      }
    });
    return this.allUserIdListData;
  }

  // 获取数据列表平铺
  getAllCheckedItem(item) {
    const ischecked = item.checked;
    if (this.hasChildItems(item)) {
      this.setChildItems(item, ischecked);
    } else {
      if (ischecked) {
        this.selectedData.push(item);
      } else {
        const itemIndex = this.getItemIndex(this.selectedData, item);
        this.selectedData.splice(itemIndex, 1);
      }
    }
    return this.uniqueList(this.selectedData);
  }

  // 获取子组件点击的对象
  selectedData: any = [];

  getCheckedItem(item: any) {
    //  console.log(item)
    let ischecked = item.checked;
    if (this.hasChildItems(item)) {
      this.setChildItems(item, ischecked);
    } else {
      if (ischecked) {
        this.selectedData.push(item);
      } else {
        let itemIndex = this.getItemIndex(this.selectedData, item);
        this.selectedData.splice(itemIndex, 1);
      }
    }
    this.userListData = this.uniqueList(this.selectedData);
  }

  //  选择会议室
  selRoomFn($event, room) {
    let ischecked = $event.target.checked;
    if (ischecked) {
      this.roomList.push(room);
    } else {
      this.removeListById(this.roomList, room);
    }
    this.roomListData = this.roomList;
  }

  //  移除会议室
  removeRoom(room: any) {
    if (+room.userId === +this.hostUserId) {
      this.hostUserId = '';
    }
    room.checked = false;
    this.removeListById(this.roomListData, room);
    // this.setRoomListFn(this.roomListData);
  }

  removeUser(user: any) {
    if (+user.userId === +this.hostUserId) {
      this.hostUserId = '';
    }
    if (this.searchByUserName !== '') {
      this.searchUserFn('');
      setTimeout(() => {
        user.checked = false;
        this.removeListById(this.userListData, user);
        this.treeviewOneClick(user);
        this.searchUserFn(this.searchByUserName);
      });
    } else {
      user.checked = false;
      this.removeListById(this.userListData, user);
      this.treeviewOneClick(user);
    }
    // this.setTreeUserFn(this.userListData);
  }

  // 清空参会方
  emptyUserFn() {
    this.searchUserFn('');
    setTimeout(() => {
      // 参会者
      this.hostUserId = '';
      this.userList = [];
      this.userListData = [];
      // this.setTreeUserFn(this.userListData);
      this.treeviewOneDomInputs[0].click();
      if (this.treeviewOneDomInputs[0].checked) {
        this.treeviewOneDomInputs[0].click();
      }
      this.searchUserFn(this.searchByUserName);
      // 会议室
      this.roomList = [];
      this.roomListData = [];
      this.setRoomListFn(this.roomListData);
    });
  }

  /* 通过userid判断元素是否在数组内 */
  removeListById(arr, list) {
    var i = arr.length;
    while (i--) {
      if (arr[i].userId === list.userId) {
        arr.splice(i, 1);
        return true;
      }
    }
    //  return false;
    return arr;
  }


  // 选择主讲人
  hostUserId: any;
  sureHostUserId: any;

  chooseHostFn(list: any, $event) {
    if ($event.target.checked) {
      this.hostUserId = list.userId;
    }
  }

  //  确定提交所选参会者
  sureAttendFn() {
    this.searchByUserName = '';
    this.searchByRoomName = '';
    this.sureHostUserId = this.hostUserId;
    this.attendListData = [];
    this.userListData.forEach(item => {
      this.attendListData.push(item);
    });
    this.roomListData.forEach(item => {
      this.attendListData.push(item);
    });
    this.attendListData.forEach(item => {
      item.isHost = item.userId == this.hostUserId;
    });
    this.outPutAttendData.emit(this.attendListData);
    this.addAttendModal = false;
    this.hide_emitter.emit(this.addAttendModal);
  }

  handCancle() {
    this.searchByUserName = '';
    this.searchByRoomName = '';
    this.addAttendModal = false;
    this.hide_emitter.emit(this.addAttendModal);
    this.emptyUserFn();
  }

  // 组件卸载的时候取消订阅
  //  ngOnDestroy() : void {
  //    this.addAttendModal.unsubscribe();
  //  }

  /**** 联动选择框操作 *****/
  // 根据userid判断是否存在重复数据
  uniqueList(arr: any) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i].userId]) {
        res.push(arr[i]);
        json[arr[i].userId] = 1;
      }
    }
    return res;
  }

  //  获取已存在的值的下标
  getItemIndex(arr: any, item: any) {
    let itemId = item.userId;
    var index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].userId == itemId) {
        return index = i;
      }
    }
    return index;
  }

  //  是否存在子元素
  hasChildItems(item) {
    return !!item.children;
  }

  //  设置子元素 checked
  setChildItems(changeItem, checkedState) {
    for (var childItem of changeItem.children) {
      childItem.checked = checkedState;
      if (this.hasChildItems(childItem)) {
        this.setChildItems(childItem, checkedState);
      } else {
        if (checkedState) {
          this.selectedData.push(childItem);
        } else {
          //  this.selectedData.splice(this.selectedData.indexOf(childItem),1);
          let itemIndex = this.getItemIndex(this.selectedData, childItem);
          this.selectedData.splice(itemIndex, 1);

        }
      }
    }

  }
}
