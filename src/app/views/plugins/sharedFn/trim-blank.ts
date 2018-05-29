/**
 * Created by zipeng on 2017/11/14.
 */
export class TrimBlank {

  // 禁止一开始的输入为空格
  static trimFirstBlank(e) {
    e.target.value = e.target.value.replace(/^\s+/, '');
  }
}
