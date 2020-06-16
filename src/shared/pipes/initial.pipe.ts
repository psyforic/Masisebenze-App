import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initial'
})
export class InitialPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value !== null || value !== undefined) {
      return value.substring(0, 1).toUpperCase();
    }
  }
}
