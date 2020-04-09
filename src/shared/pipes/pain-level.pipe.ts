import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'painLevel'
})
export class PainLevelPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    switch (value) {
      case 0:
        return 'significant pain indicators';
      case 1:
        return 'moderate pain indicators initially, possibly progressing to significant pain indicators';
      case 2:
        return 'minimal to no pain indicators';
      case 3:
        return 'minimal pain indicators minimum to moderate CV exertion';
      case 4:
        return 'no pain indicators minimum CV exertion';
      default:
        return '';
    }
  }
}
