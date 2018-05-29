import {Component, OnInit, EventEmitter, ElementRef, Input, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '@services/auth.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {SplitModelService} from '../../split-model.service';

@Component({
  selector: 'split-model',
  templateUrl: './split-model.component.html',
  styleUrls: ['./split-model.component.css']
})
export class SplitModelComponent implements OnInit {
  @Output() outPutSplitData: EventEmitter<any> = new EventEmitter();//子传父
  @Input() inputParentData: any;//父传子  获取来自父组件的数据
  splitModeData: any;
  // 存放屏幕设置提交的数据
  splitModeSubmitData: any = {
    splitMode: 5, //设置分屏模式
    mode_show: '2', //设置轮询屏
    pollingtime: '15', //轮询时间
    splitArrHide: [],  //左边分屏选择的人员列表
    rightSelectHide: [], //右边轮询的人
    polling: false,  //是否轮询
    isFirst: false,  //是否第一次设置
    isSame: false,

    selectAttendeData: [],//用于分屏模式里面指定人(去除不在线后的参会者)
    leftSelectData: [],//
    rightSelectData: []
  };
  selectModel: any = []; //屏幕固定人员数据
  constructor(private el: ElementRef,
              private http: HttpClient,
              private authService: AuthService,
              private splitModelService: SplitModelService,
              private _notification: NzNotificationService) {
  }

  ngOnInit() {
    this.getSplitScreen();
  }

  /********* 获取分屏信息及轮询的人 *********/
  getSplitScreen() {
    this.splitModelService.getSplitScreen(this.inputParentData).subscribe(
      res => {
        const resultData: any = res;
        if (+resultData.code === 200) {
          this.splitModeData = resultData.data;

          this.outPutSplitData.emit(this.splitModeSubmitData);

          //第一次设置分屏 初始化轮询信息
          if (resultData.data.isFirst) {
            this.splitModeSubmitData.splitMode = 5; //设置分屏模式 默认自动分屏
            this.splitModeSubmitData.selectAttendeData = resultData.data.onLineList;//分屏模式里的在线人员
            this.splitModeSubmitData.leftSelectData = resultData.data.onLineList;//不参与轮询的人
          } else { //已设置过分屏

            this.selectModel = resultData.data.splitArrHide;
            this.splitModeSubmitData.isSame = resultData.data.isSame;//是否相同分屏
            this.splitModeSubmitData.mode_show = resultData.data.mode_show;//设置分屏模式
            this.splitModeSubmitData.splitMode = resultData.data.splitMode;//设置轮询屏
            this.splitWay(resultData.data.splitMode, false);
            this.splitModeSubmitData.polling = resultData.data.polling;//是否轮询
            this.splitModeSubmitData.pollingtime = this.pollingtime = resultData.data.pollingtime || '15';//轮询间隔时间
            this.splitModeSubmitData.selectAttendeData = resultData.data.onLineList;//分屏模式里的在线人员

            this.splitModeSubmitData.leftSelectData = resultData.data.onLineList;//回显不参与轮询的人 字符串转数组
            // this.splitModeSubmitData.rightSelectData = resultData.data.rightSelectData;//回显参与轮询的人 字符串转数组
            // this.pollingtime = resultData.data.pollingtime;//轮询间隔时间
            //轮询列表回显
            var left = resultData.data.onLineList;
            var rightPuuid = resultData.data.rightSelectHide;
            //判断是否存在
            let intersectionSet = left.filter(function (v) {
              return rightPuuid.indexOf(v.puuid) > -1;
            });
            this.splitModeSubmitData.rightSelectData = this.changeToOther(intersectionSet, 'right');
          }
        } else {
          this._notification.create('error', '操作失败', '');
        }
      },
      err => {
        console.log(' error...');
      });
  }


  // 设置相同分屏
  // isSame:boolean = false;
  setSameSplit(state: any) {
    this.splitModeSubmitData.isSame = state;
  }

  /****** 分屏方式 设置 *******/
  splitBox1: any;
  splitBox2: any;
  splitBox3: any;
  modeSelectArr: any;
  isAutoSplit = true; //是否自动分屏
  isPolling: any;  //是否轮询
  splitWayFn(way: any) {
    this.splitModeSubmitData.splitMode = way;
    this.selectModel = [];
    this.splitModeSubmitData.splitArrHide = [];

    switch (way + '') {
      case '0'://分屏方式 一分屏
        for (let i = 0; i < 1; i++) {
          this.selectModel.push('0');
          this.splitModeSubmitData.splitArrHide.push('0');
        }
        break;
      case '1':
        for (let i = 0; i < 8; i++) {
          this.selectModel.push('0');
          this.splitModeSubmitData.splitArrHide.push('0');
        }
        break;
      case '2':
        for (let i = 0; i < 22; i++) {
          this.selectModel.push('0');
          this.splitModeSubmitData.splitArrHide.push('0');
        }
        break;
      case '3':
        for (let i = 0; i < 4; i++) {
          this.selectModel.push('0');
          this.splitModeSubmitData.splitArrHide.push('0');
        }
        break;
      case '4':
        for (let i = 0; i < 23; i++) {
          this.selectModel.push('0');
          this.splitModeSubmitData.splitArrHide.push('0');
        }
        break;

    }
    this.splitWay(way + '', true);
  }

  splitWay(way: any, flag: boolean) {//flag：true，点击；false，回显
    this.splitBox1 = this.splitBox2 = this.splitBox3 = [];
    if (!flag) {
      this.splitModeSubmitData.splitArrHide = this.selectModel;
    }
    switch (way) {
      case '0'://分屏方式 一分屏
        this.splitBox1 = [1];
        //轮询屏
        this.modeSelectArr = [1];
        for (let i = 0; i < 1; i++) {
          // this.splitModeSubmitData.splitArrHide.push("0")
        }
        this.isAutoSplit = false;
        if (flag) {
          this.splitModeSubmitData.mode_show = 1;
        }
        break;
      case '1'://分屏方式 1+7
        this.splitBox1 = [1];
        this.splitBox3 = [2, 3, 4, 5, 6, 7, 8];
        //轮询屏
        this.modeSelectArr = [1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = 0; i < 8; i++) {
          // this.splitModeSubmitData.splitArrHide.push("0");
        }
        this.isAutoSplit = false;
        if (flag) {
          this.splitModeSubmitData.mode_show = 2;
        }
        break;
      case '2'://分屏方式 1+21
        this.splitBox1 = [1];
        this.splitBox3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        //轮询屏
        this.modeSelectArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        for (let i = 0; i < 22; i++) {
          // this.splitModeSubmitData.splitArrHide.push("0");
        }
        this.isAutoSplit = false;
        if (flag) {
          this.splitModeSubmitData.mode_show = 2;
        }
        break;
      case '3'://分屏方式 四分屏
        this.splitBox2 = [1, 2, 3, 4];
        //轮询屏
        this.modeSelectArr = [1, 2, 3, 4];
        for (let i = 0; i < 4; i++) {
          // this.splitModeSubmitData.splitArrHide.push("0");
        }
        this.isAutoSplit = false;
        if (flag) {
          this.splitModeSubmitData.mode_show = 2;
        }
        break;
      case '4'://分屏方式 2+21
        this.splitBox2 = [1, 2];
        this.splitBox3 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        //轮询屏
        this.modeSelectArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        for (let i = 0; i < 23; i++) {
          // this.splitModeSubmitData.splitArrHide.push("0");
        }
        this.isAutoSplit = false;
        if (flag) {
          this.splitModeSubmitData.mode_show = 2;
        }
        break;
      case '5': //分屏方式 自动分屏
        this.isAutoSplit = true;
        this.isPolling = 0;
        this.splitModeSubmitData.polling = false;
        break;
      // default:

    }
    if (way == 0) {
      this.changeModeShow(1);
    }

  }


  changePolling() {
    console.log(this.splitModeSubmitData);
    if (this.splitModeSubmitData.polling) {
      if (this.splitModeSubmitData.mode_show == 0) {
        this.changeModeShow(1);
      } else {
        this.changeModeShow(this.splitModeSubmitData.mode_show);
      }
    }
  }

  /*轮询屏幕*/
  changeModeShow(modeShow: any) {
    this.splitModeSubmitData.mode_show = modeShow;
    let Modeindex = parseInt(modeShow, 10) - 1;
    this.splitModeSubmitData.splitArrHide[Modeindex] = '0';
    if (modeShow != 'undefind' && modeShow != 5) {
      let idkey = 'select_' + modeShow;
      // document.getElementById(idkey).value = "";
      // this.el.nativeElement.querySelector('#'+idkey).value = "";
    }
  }

  /**** 指定屏幕参会者 ****/
  OldsplitArrHide: any = this.splitModeSubmitData.splitArrHide;

  changeUser($event, n) {
    let selectIndex = n - 1;
    let selectPuuid = $event.target.value;
    this.splitModeSubmitData.splitArrHide[selectIndex] = selectPuuid;
    // if(this.isInArray(selectPuuid) && (selectPuuid != "0")){
    //   this._notification.create('error', '不能重复选择指定人员','');
    //   $event.target.value="0";
    //   this.splitModeSubmitData.splitArrHide[selectIndex] = "0";
    // }else{
    //   this.splitModeSubmitData.splitArrHide[selectIndex] = selectPuuid;
    // }

  }


  /**
   * 使用循环的方式判断一个元素是否存在于一个数组中
   *  {Object} arr 数组
   *  {Object} value 元素值
   */
  isInArray(value) {
    if (value) {
      for (let i = 0; i < this.splitModeSubmitData.splitArrHide.length; i++) {
        if (value === this.splitModeSubmitData.splitArrHide[i]) {
          return true;
        }
      }
      return false;
    }
    return false;

  }


  /***** 轮询列表操作 ******/
    // list: any[] = [];
  pollingtime: any = 15; //轮询间隔时间
  leftSelectData: any = [];//用于渲染dom  左侧不参与轮询的人
  rightSelectData: any = [];//用于渲染dom 右侧参与轮询的人

  select(ret: any) {
  }


  change(ret: any) {
    console.log('nzChange', ret);
    let list: any = ret.list;
    for (let i = 0; i < list.length; i++) {
      if (ret.from == 'left') {
        this.splitModeSubmitData.rightSelectData.push(list[i]);
      } else {
        this.splitModeSubmitData.rightSelectData.splice(this.splitModeSubmitData.rightSelectData.indexOf(list[i]), 1);
      }

    }
  }

  changeToOther(arr: any, type: string) {
    let returnData: any = [];
    arr.forEach(item => {
      item.direction = type;
      returnData.push(item);
    });
    return returnData;
  }
}
