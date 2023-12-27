import { AbstractControl } from '@angular/forms';

export function PasswordValidator(password: string, confPass: string) {
  return (control: AbstractControl) => {
    if (control.get(password)?.value === control.get(confPass)?.value) {
      return null;
    } else {
      return { passwordsMisMatch: true };
    }
  };
}
