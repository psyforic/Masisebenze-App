import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'painLevel'
})
export class PainLevelPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    switch (value) {
      case 0:
        return 'No Pain';
      case 1:
        return 'Hurts A Little';
      case 2:
        return 'Hurts A Little More';
      case 3:
        return 'Hurts Even More';
      case 4:
        return 'Hurts A Whole Lot';
      case 5:
        return 'Hurts Worse';
      default:
        return '';
    }
  }
}
