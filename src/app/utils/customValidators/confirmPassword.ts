import { AbstractControl } from '@angular/forms';

export function PasswordValidator(password: string, confPass: string) {
  return (control: AbstractControl) => {
    if (
      password != '' &&
      confPass != '' &&
      control.get(password)?.value === control.get(confPass)?.value
    ) {
      return null;
    } else {
      control.get(confPass)?.setErrors({ invalid: true });
      return { passwordsMisMatch: true };
    }
  };
}
