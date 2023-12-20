import { Pipe, PipeTransform, inject } from '@angular/core';
import { Shift } from '../../Interfaces';

@Pipe({
  name: 'customFilter',
})
export class CustomFilterPipe implements PipeTransform {
  transform(value: any[], ...args: string[]): any[] {
    const shiftsToFilter: any[] = JSON.parse(JSON.stringify(value));

    const [filterName, filterStartDate, filterEndDate, type] = args;

    console.log(args);

    if (args.length === 0) return value;

    if (type === 'shifts') {
      const filteredShifts: any[] = shiftsToFilter.filter((shift) => {
        const shiftName =
          !filterName || shift.workplace.toLowerCase().includes(filterName);
        const shiftStartDate =
          !filterStartDate ||
          this.getTimeFromDate(filterStartDate) <=
            this.getTimeFromDate(shift.shiftDate);
        const shiftEndDate =
          !filterEndDate ||
          this.getTimeFromDate(filterEndDate) >=
            this.getTimeFromDate(shift.shiftDate);

        return shiftName && shiftStartDate && shiftEndDate;
      });

      return filteredShifts;
    } else if (type === 'users') {
      return value.filter((user) =>
        user.firstName.toLowerCase().includes(filterName)
      );
    } else {
      return value;
    }
  }

  getTimeFromDate(value: string): Date {
    return new Date(value);
  }
}
