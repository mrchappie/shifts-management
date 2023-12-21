import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { State } from '../../Interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private state: State = {
    currentUserCred: undefined,
    currentLoggedFireUser: undefined,
    currentUserShifts: undefined,
    isEditing: false,
    isLoggedIn: false,
    isAdmin: false,
    activeComponent: 'Dashboard',
    shiftToEdit: undefined,
    shiftsCount: 0,
    searchForm: {
      nameQuery: '',
      startDateQuery: '',
      endDateQuery: '',
      sortByQuery: '',
      orderByQuery: '',
      // setting the default year-month to current year-month
      yearMonthQuery: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }`,
    },
  };

  private stateSubject = new Subject<State>();
  stateChanged = this.stateSubject.asObservable();

  getState() {
    return this.state;
  }

  setState(data: object) {
    this.state = { ...this.state, ...data };

    this.stateSubject.next(this.state);
  }
}

export const initialState = {
  currentUserCred: undefined,
  currentLoggedFireUser: undefined,
  currentUserShifts: undefined,
  isEditing: false,
  isLoggedIn: false,
  isAdmin: false,
  activeComponent: 'Dashboard',
  shiftToEdit: undefined,
  shiftsCount: 0,
  searchForm: {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
    yearMonthQuery: '',
  },
};
