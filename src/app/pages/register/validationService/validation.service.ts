import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  getFormStatus(form: FormGroup, control: string): boolean {
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
    if (form.get(control)?.hasError('required')) {
      return 'This field is required';
    }

    if (control === 'email') {
      if (form.get(control)?.hasError('pattern')) {
        return 'Provide a valid email adress';
      }
    }

    if (control === 'password') {
      if (form.get(control)?.hasError('pattern')) {
        return '8+ chars, uppercase, lowercase, digit, special char';
      }
    }

    if (control === 'confPass') {
      if (form.hasError('passwordsMisMatch')) {
        return 'Passwords do not match';
      }
    }

    if (control === 'firstName') {
      if (form.get(control)?.hasError('minlength')) {
        return 'First name must be longer than 2 chars';
      }
    }

    if (control === 'lastName') {
      if (form.get(control)?.hasError('minlength')) {
        return 'Last name must be longer than 2 chars';
      }
    }

    if (control === 'dob') {
      if (form.get(control)?.hasError('ageIsNotLegal')) {
        return 'Your age must be between 18 and 65 years';
      }
    }

    return '';
  }
}
