import { AbstractControl } from '@angular/forms';
import { calculateAge } from 'src/app/utils/functions';

const MIN_WORK_AGE: number = 18;
const MAX_WORK_AGE: number = 65;
export function AgeValidation(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const birthDate: string = control.value;
  const age: number = Number(calculateAge(new Date(birthDate)));

  if (age && age >= MIN_WORK_AGE && age <= MAX_WORK_AGE) {
    return null;
  } else {
    return { ageIsNotLegal: true };
  }
}
