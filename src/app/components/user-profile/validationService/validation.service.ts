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

    if (control != 'dob') {
      return (
        form.get(control)!.invalid &&
        (form.get(control)!.dirty || form.get(control)!.touched)
      );
    } else {
      return (
        form.get(control)!.invalid &&
        ((form.get(control)!.touched && form.get(control)!.dirty) ||
          (form.get(control)!.untouched && form.get(control)!.dirty) ||
          (form.get(control)!.touched && form.get(control)!.pristine))
      );
    }
  }

  getErrorMessage(form: FormGroup, control: string): string {
    // return error if field was touched but not completed
    if (form.get(control)?.hasError('required')) {
      return errorMessages.required;
    }

    // return error for every input if inputed data is not valid
    if (control === 'firstName') {
      if (form.get(control)?.hasError('minlength')) {
        return errorMessages.profile.firstName;
      }
    }

    if (control === 'lastName') {
      if (form.get(control)?.hasError('minlength')) {
        return errorMessages.profile.lastName;
      }
    }

    if (control === 'dob') {
      if (form.get(control)?.hasError('ageIsNotLegal')) {
        return errorMessages.profile.dob;
      }
    }

    if (control === 'phoneNumber') {
      if (form.get(control)?.hasError('minLength')) {
        return errorMessages.profile.phoneNumber;
      } else {
        return errorMessages.profile.phoneNumber;
      }
    }

    return '';
  }
}
