import { Pipe, PipeTransform } from '@angular/core';
import { Shift } from '../../Interfaces';

@Pipe({
  standalone: true,
  name: 'customSort',
  standalone: true,
})
export class CustomSortPipe implements PipeTransform {
  convertToMiliseconds(time: string) {
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    return (Number(hours) * 3600 + Number(minutes) * 60) * 1000;
  }

  transform(value: Shift[], ...args: string[]): Shift[] {
    const shiftsToSort: Shift[] = structuredClone(value);
    const sortByQuery: string = args[0];
    const orderByQuery: string = args[1];

    switch (sortByQuery) {
      //! CASE FOR SORTING SHIFTS BY TIMESTAMP AT LOAD
      // case '':
      //   shiftsToSort.sort((a: Shift, b: Shift) => {
      //     const { seconds: secondsA } = a['timeStamp'] as any;
      //     const { seconds: secondsB } = b['timeStamp'] as any;
      //     console.log(
      //       new Date(secondsA).getDate(),
      //       new Date(secondsB).getDate()
      //     );
      //     return new Date(secondsA).getTime() - new Date(secondsB).getTime();
      //   });
      //   break;
      case 'workplace':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return a['workplace'].localeCompare(b['workplace']);
        });
        break;
      case 'shiftDate':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return (
            new Date(a['shiftDate']).getTime() -
            new Date(b['shiftDate']).getTime()
          );
        });
        break;
      case 'startTime':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return (
            this.convertToMiliseconds(a['startTime']) -
            this.convertToMiliseconds(b['startTime'])
          );
        });
        break;
      case 'endTime':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return (
            this.convertToMiliseconds(a['endTime']) -
            this.convertToMiliseconds(b['endTime'])
          );
        });
        break;
      case 'wagePerHour':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return Number(a['wagePerHour']) - Number(b['wagePerHour']);
        });
        break;
      case 'shiftRevenue':
        shiftsToSort.sort((a: Shift, b: Shift) => {
          return Number(a['shiftRevenue']) - Number(b['shiftRevenue']);
        });
        break;

      default:
        break;
    }

    return orderByQuery === 'asc' ? shiftsToSort : [...shiftsToSort].reverse();
  }
}
