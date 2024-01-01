import { Injectable } from '@angular/core';
import { State } from '../../Interfaces';
import { StateService } from '../state/state.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFnService {
  constructor(private state: StateService) {}

  calculateAge(dateString: Date): number | null {
    const birthDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      return null;
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  getCurrentYearMonth(): string[] {
    const state = this.state.getState();
    // prettier-ignore
    const months: string[]=["january","february","march","april","may","june","july",
      "august", "september", "october", "november", "december"];

    if (state.searchForm.yearMonthQuery === '') {
      const currentYear: string = new Date().getFullYear().toString();
      const currentMonth: string = months[new Date().getMonth()];
      return [currentYear, currentMonth];
    } else {
      const yearMonth = state.searchForm.yearMonthQuery.split('-');
      return [yearMonth[0], months[+yearMonth[1] - 1]];
    }
  }

  getCurrentYear() {
    return new Date().getFullYear().toString();
  }

  getCurrentMonth() {
    return (new Date().getMonth() + 1).toString().padStart(2, '0');
  }
}
