import {Injectable, EventEmitter, Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/**
 * 用来充当事件总线的Service
 */
  // 1，设置装饰器，表示这个可以注入，然后可以让两个兄弟组件都注入这个service，那么两个组件就有了同一个service实例（这是angular依赖注入的特性，注入的对象都是全局单例的，所以都是同一个实例），是同一个实例之后，我们就可以在这个类里面做一些事情了，跳到2
@Injectable()
export class EventBusService {
  // 2，我们在service类中定义一个Subject类型的eventBus属性，Subject类型是一种可以subscribe到的主题，那么两个组件中其中一个组件通过next方法发出一个主题，然后另一个组件就可以通过subscribe方法接收到这个东西了，这样就完成通讯了，
  // 个人信息 姓名
  public editRealNameFn: Subject<string> = new Subject<string>();
  // 未读消息数
  public msgCountFn: Subject<any> = new Subject<any>();
  // 菜单切换
  public changeFlag: EventEmitter<number>;
  // 企业服务状态
  public entServiceData: EventEmitter<number>;
  public setServiceSecondsChange: EventEmitter<any>;
  // 投票
  public voteStatus: EventEmitter<boolean>;
  public isOpenAudio: EventEmitter<boolean>;
  // 企业定制
  public templateType: EventEmitter<string>;
  public entShowName: EventEmitter<string>;
  public slogan: EventEmitter<string>;
  public logURL: EventEmitter<string>;
  // 入会设置
  public conferenceSetting: EventEmitter<string>;

  constructor() {
    this.changeFlag = new EventEmitter();

    this.entServiceData = new EventEmitter();
    this.setServiceSecondsChange = new EventEmitter();

    this.voteStatus = new EventEmitter();
    this.isOpenAudio = new EventEmitter();

    this.templateType = new EventEmitter();
    this.entShowName = new EventEmitter();
    this.slogan = new EventEmitter();
    this.logURL = new EventEmitter();

    this.conferenceSetting = new EventEmitter();
  }
}
