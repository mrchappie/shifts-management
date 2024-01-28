import { Pipe, PipeTransform } from '@angular/core';
import { UserSettings } from '../../Interfaces';

@Pipe({
  standalone: true,
  name: 'customUsersSort',
})
export class CustomUsersSortPipe implements PipeTransform {
  transform(value: UserSettings[], ...args: string[]): UserSettings[] {
    const shiftsToSort: UserSettings[] = structuredClone(value);
    const sortByQuery: string = args[0];
    const orderByQuery: string = args[1];

    switch (sortByQuery) {
      case 'firstName':
        shiftsToSort.sort((a: UserSettings, b: UserSettings) => {
          return a['firstName'].localeCompare(b['firstName']);
        });
        break;
      case 'lastName':
        shiftsToSort.sort((a: UserSettings, b: UserSettings) => {
          return a['lastName'].localeCompare(b['lastName']);
        });
        break;
    }

    return orderByQuery === 'asc' ? shiftsToSort : [...shiftsToSort].reverse();
  }
}
