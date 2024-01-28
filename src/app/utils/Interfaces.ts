import { UserCredential } from '@angular/fire/auth';

export interface State {
  emailVerified: boolean;
  currentUserCred?: UserCredential;
  currentLoggedFireUser?: UserSettings;
  currentUserShifts?: Shift[];
  isLoggedIn: boolean;
  role: string | undefined;
  activeComponent: string;
  isEditing: boolean;
  shiftToEdit: Shift | undefined;
  editedUserData?: UserSettings;
  shiftsCount: number;
  // fetched shifts

  searchForm: SearchFilters;

  updateStats: boolean;
}

export interface UserSettings {
  accountCreationDate: Date;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  age: number;
  id: string;
  phoneNumber: string;
  profileImage: string;
  role: string;
  userWorkplaces: string[];
}

export interface Shift {
  shiftID: string;
  userID: string;
  shiftDate: number;
  startTime: number;
  endTime: number;
  workplace: string;
  wagePerHour: number;
  shiftRevenue: number;
  creationDate: Date;
  lastUpdateDate: Date;
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
  userNames?: string;
}
