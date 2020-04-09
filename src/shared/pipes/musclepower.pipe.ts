import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musclepower'
})
export class MusclepowerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value === 0 ? '' : value;
  }

}
