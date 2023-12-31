import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { State } from '../../Interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private state: State = {
    emailVerified: false,
    currentUserCred: undefined,
    currentLoggedFireUser: undefined,
    isLoggedIn: false,
    isAdmin: false,
    activeComponent: 'Dashboard',
    isEditing: false,
    shiftToEdit: undefined,
    editedUserData: undefined,
    shiftsCount: 0,
    // fetched shifts
    shifts: [],

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
      queryLimit: 10,
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
  emailVerified: false,
  currentUserCred: undefined,
  currentLoggedFireUser: undefined,
  currentUserShifts: undefined,
  isLoggedIn: false,
  isAdmin: false,
  activeComponent: 'Dashboard',
  isEditing: false,
  shiftToEdit: undefined,
  editedUserData: undefined,
  shiftsCount: 0,
  // fetched shifts
  shifts: [],

  searchForm: {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
    yearMonthQuery: '',
    queryLimit: 10,
  },
};
