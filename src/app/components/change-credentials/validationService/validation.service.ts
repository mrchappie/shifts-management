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

  getErrorMessage(form: FormGroup, control: string): string {
    // return error if field was touched but not completed
    if (form.get(control)?.hasError('required')) {
      return errorMessages.required;
    }

    // return error for every input if inputed data is not valid
    if (control === 'password') {
      if (form.get(control)?.hasError('minLength')) {
        return errorMessages.credentials.password.invalid;
      }
    }

    if (control === 'oldPass') {
      if (form.get(control)?.hasError('minLength')) {
        return errorMessages.credentials.oldPass.invalid;
      }
    }

    if (control === 'newPass') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.newPass.invalid;
      }
    }

    if (control === 'confNewPass') {
      if (form.hasError('passwordsMisMatch')) {
        return errorMessages.credentials.confNewPass.notMatch;
      }
    }

    if (control === 'email') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.email;
      }
    }

    if (control === 'oldEmail') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.oldEmail;
      }
    }

    if (control === 'newEmail') {
      if (form.get(control)?.hasError('pattern')) {
        return errorMessages.credentials.newEmail;
      }
    }

    return '';
  }
}
