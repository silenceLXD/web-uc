import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'checkSipNumber'
})

/* 自定义管道 checkSipNumber
 * 检测sip账号规则（旧数据使用）
*/
export class CheckSipNumberPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const inputVal = '' + value;
    const fdStart = inputVal.indexOf('86'); //假如是大于0 包含该字符串
    if (inputVal.length == 13 && fdStart == 0) { //表示strCode是以ssss开头；
      return '+' + inputVal;
    } else if (fdStart == -1) { //表示strCode不是以ssss开头
      return inputVal;
    } else {
      return inputVal;
    }
  }

}
