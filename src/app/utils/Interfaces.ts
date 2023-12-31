import { UserCredential } from '@angular/fire/auth';

export interface State {
  emailVerified: boolean;
  currentUserCred?: UserCredential;
  currentLoggedFireUser?: UserSettings;
  currentUserShifts?: Shift[];
  isEditing: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  activeComponent: string;
  shiftToEdit: Shift | undefined;
  shiftsCount: number;
  // fetched shifts
  shifts: Shift[];

  searchForm: SearchFilters;
}

export interface UserSettings {
  accountCreationDate: Date;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  id: string;
  phoneNumber: string;
  profileImage: string;
  adminPanel: {
    isAdmin: boolean;
  };
  userWorkplaces: string[];
  shiftsCount: {
    lastWeek: number;
    thisWeek: number;
    nextWeek: number;
    totalShifts: number;
  };
}

export interface Shift {
  shiftID: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  workplace: string;
  wagePerHour: number;
  shiftRevenue: number;
  timeStamp: Date;
  [key: string]: any;
  userInfo: {
    firstName: string;
    lastName: string;
  };
}

export interface SearchFilters {
  nameQuery: string;
  startDateQuery: string;
  endDateQuery: string;
  sortByQuery: string;
  orderByQuery: string;
  yearMonthQuery: string;
  queryLimit: number;
}
