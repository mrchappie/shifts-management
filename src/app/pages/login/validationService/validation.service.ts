import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  getFormStatus(form: FormGroup, control: string): boolean {
    return (
      form.get(control)!.invalid &&
      (form.get(control)!.dirty || form.get(control)!.touched)
    );
  }

  getErrorMessage(form: FormGroup, control: string): string {
    if (control === 'email') {
      if (form.get(control)?.hasError('required')) {
        return 'This field is required';
      }
      if (form.get(control)?.hasError('pattern')) {
        return 'Provide a valid email adress';
      }
    }
    if (control === 'password') {
      if (form.get(control)?.hasError('required')) {
        return 'This field is required';
      } else {
        return 'Password is to short';
      }
    }

    return '';
  }
}
