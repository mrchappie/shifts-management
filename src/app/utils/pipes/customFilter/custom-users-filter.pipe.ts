import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customUsersFilter'
})
export class CustomUsersFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
