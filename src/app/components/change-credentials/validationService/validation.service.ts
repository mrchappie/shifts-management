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
    return (
      form.get(control)!.invalid &&
      ((form.get(control)!.touched && form.get(control)!.dirty) ||
        (form.get(control)!.untouched && form.get(control)!.dirty) ||
        (form.get(control)!.touched && form.get(control)!.pristine))
    );
  }

  getEmailErrorMessage(form: FormGroup, control: string): string {
    // return error if field was touched but not completed
    if (form.get(control)?.hasError('required')) {
      return errorMessages.required;
    }

    // return error for every input if inputed data is not valid
    if (control === 'password') {
      if (form.get(control)?.hasError('minlength')) {
        return errorMessages.credentials.password.short;
      }
    }

    if (control === 'oldEmail') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.email;
      }
    }

    if (control === 'newEmail') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.email;
      }
    }

    return '';
  }

  getPasswordErrorMessage(form: FormGroup, control: string): string {
    // return error if field was touched but not completed
    if (form.get(control)?.hasError('required')) {
      return errorMessages.required;
    }

    if (control === 'email') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.email;
      }
    }

    if (control === 'oldPass') {
      if (form.get(control)?.hasError('minlength')) {
        return errorMessages.credentials.password.short;
      }
    }

    if (control === 'newPass') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.password.invalid;
      }
    }

    if (control === 'confNewPass') {
      console.log(form.errors);

      if (form.hasError('passwordsMisMatch')) {
        return errorMessages.credentials.password.notMatch;
      }
    }

    return '';
  }
}
