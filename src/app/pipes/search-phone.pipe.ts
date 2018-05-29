import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchPhone'
})
export class SearchPhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const _out = [];
    if (!args) {
      return value;
    } else if (value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].mobilePhone.indexOf(args) != -1) {
          _out.push(value[i]);
        }
      }
    }
    return _out;
  }

}
