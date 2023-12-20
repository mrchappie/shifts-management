import { Pipe, PipeTransform } from '@angular/core';
import { Shift } from '../../Interfaces';

@Pipe({
  name: 'customSorter',
})
export class CustomSorterPipe implements PipeTransform {
  transform(value: Shift[], ...args: string[]): Shift[] {
    // const shiftsToSort: Shift[] = JSON.parse(JSON.stringify(value));
    // const sorterByQuery: string = args[0];
    // const orderByQuery: string = args[1];

    // console.log(sorterByQuery, orderByQuery);
    // console.log(args);

    // if (orderByQuery === 'asc') {
    //   const sortedShifts = shiftsToSort.sort((a, b) => {
    //     console.log(sorterByQuery);
    //     console.log(a, b);

    //     type ObjectKey = keyof typeof a;

    //     const propA = a[sorterByQuery as ObjectKey];
    //     const propB = b[sorterByQuery as ObjectKey];
    //     console.log(a[propA], b[propB]);

    //     return a[propA] - b[propB];
    //   });
    //   console.log(sortedShifts);
    //   return sortedShifts;
    // } else if (orderByQuery === 'dsc') {
    //   shiftsToSort.sort((a, b) => {
    //     return b[sorterByQuery] - a[sorterByQuery];
    //   });
    //   console.log(shiftsToSort);
    //   return shiftsToSort;
    // } else {
    //   return value;
    // }
    return value;
  }
}
