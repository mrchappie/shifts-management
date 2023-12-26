import { AbstractControl } from '@angular/forms';
import { calculateAge } from 'src/app/utils/functions';

export function AgeValidation(dob: string = 'dob') {
  const MIN_WORK_AGE: number = 18;
  const MAX_WORK_AGE: number = 65;
  return (control: AbstractControl) => {
    const birthDate: string = control.get(dob)!.value;
    const age: number = Number(calculateAge(new Date(birthDate)));
    console.log(age);
    console.log(control.get(dob)!.value);
    console.log(age >= MIN_WORK_AGE && age <= MAX_WORK_AGE);

    if (age && age >= MIN_WORK_AGE && age <= MAX_WORK_AGE) {
      return null;
    } else {
      return { ageIsNotLegal: true };
    }
  };
}
