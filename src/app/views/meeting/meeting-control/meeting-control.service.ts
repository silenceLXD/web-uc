import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '@services/common.service';

@Injectable()
export class MeetingControlService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }

  // 初始化页面信息数据
  conferenceParticipant(cid: any) {
    return this.http.get('/uc/conferences/starting/' + cid);
  }

  // 获取会议日志 每次请求20条日志数据
  showMoreLog(cid: any, pageNum:any) {
    return this.http.get('/uc/conferences/' + cid + '/log/' + pageNum +'/20');
  }

  // 添加参会者
  getAttendData(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/dial-more', data);
  }

  /* 呼叫匿名终端
    * 请求地址:uc/conference/{cid}/participant/dial-terminal
    * @param userId 呼叫人id
    * @param operatedUserId 被邀者id
    * @param entId 企业id
    * @param cid 会议id
    * @param destination 目标
    * @param displayName 名称
    * @param participantProtocolType 协议(SIP, H323, WEBRTC, RTMP, API)
    */
  getTerminalData(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/participant/dial-terminal', data);
  }

  // 根据在线状态 呼叫不同状态的用户
  callByState(cid: any, dialStatus: any) {
    return this.http.post('/uc/conferences/' + cid + '/dial/status', dialStatus);
  }

  // 确定分屏设置 处理提交的数据格式
  sureSplitFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/layOut', data);
  }

  // 参会者静音
  voiceBtnFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/mute-all', data);
  }

  // 开启／关闭直播
  liveBtnFn(cid: any, liveurl: any) {
    return this.http.post('/uc/conferences/' + cid + liveurl, '');
  }

  // 修改直播密码
  updateLiveAddress(cid: any, data: any) {
    return this.http.post('/uc/lives/' + cid + '/update-pwd', data);
  }

  // 查看直播密码
  selectLiveAddress(cid: any) {
    return this.http.get('/uc/lives/' + cid + '/info');
  }

  // 开启／关闭录制
  recordBtnFn(cid: any, isRecord: any) {
    let recordurl;
    if (isRecord) {
      //关闭录制
      recordurl = '/close-record';
    } else {
      //开启录制
      recordurl = '/open-record';
    }
    return this.http.post('/uc/conferences/' + cid + recordurl, '');
  }

  // 锁定／解锁会议
  lockBtnFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/lock', data);
  }

  // 手动结束会议
  sureStopConferenceFn(cid: any) {
    return this.http.post('/uc/conferences/' + cid + '/stop', '');
  }

  // 切换主讲人/参会者身份
  changeHostFn(cid: any, puuid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/convert/' + puuid, data);
  }

  // 切换语音开/关
  changeMuteFn(cid: any, puuid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/mute/' + puuid, data);
  }

  // 切换挂断/呼叫
  changeCallFn(cid: any, callUrl: any, puuid: any) {
    return this.http.post('/uc/conferences/' + cid + callUrl + '/' + puuid, '');
  }

  // 切换是否邀请对话
  changeDialogue(postUrl: any) {
    return this.http.post(postUrl, '');
  }

  // 处理举手
  handsUpFn(cid: any, thisPuuid: any) {
    return this.http.post('/uc/conferences/' + cid + '/un-hand-up/' + thisPuuid, '');
  }

  // 允许/拒绝等待申请入会
  handleWaitFn(cid: any, thisPuuid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/handle-wairing/' + thisPuuid, data);
  }

  // 入会时是否静音
  changeEnterMuteFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/mute-in-conference', data);
  }

  // 入会申请
  handleApplyFn(cid: any, data: any) {
    return this.http.post('/uc/conferences/' + cid + '/handle-apply', data);
  }

  // 查询在线主讲人数
  getOnlineHost(cid: any) {
    return this.http.get('/uc/conferences/' + cid + '/online-host');
  }

  // 获取参会者列表（排序)
  SSE_PARTICIPANTDto(cid: any) {
    return this.http.get('/uc/conferences/' + cid + '/participants/sort');
  }

}
