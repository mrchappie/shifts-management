import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { errorMessages } from 'src/app/utils/validationData';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  getFormStatus(form: FormGroup, control: string): boolean {
    // return form input status
    if (control != 'shiftDate') {
      return (
        form.get(control)!.invalid &&
        (form.get(control)!.dirty || form.get(control)!.touched)
      );
    } else {
      return (
        (form.get(control)!.pristine && form.get(control)!.touched) ||
        (form.get(control)!.touched && form.get(control)!.dirty)
      );
    }
  }

  getErrorMessage(form: FormGroup, control: string): string {
    // return error for every input if inputed data is not valid
    if (control === 'shiftDate') {
      if (form.get(control)?.hasError('required')) {
        return errorMessages.shift.date;
      }
    }

    if (control === 'startTime') {
      if (form.get(control)?.hasError('required')) {
        return errorMessages.shift.start;
      }
    }

    if (control === 'endTime') {
      if (form.get(control)?.hasError('required')) {
        return errorMessages.shift.end;
      }
    }
    if (control === 'workplace') {
      if (form.get(control)?.hasError('required')) {
        return errorMessages.shift.workplace;
      }
    }

    if (control === 'wagePerHour') {
      if (form.get(control)?.hasError('required')) {
        return errorMessages.shift.wage;
      }
    }

    return '';
  }
}
