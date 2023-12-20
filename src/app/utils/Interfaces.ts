import { UserCredential } from '@angular/fire/auth';

export interface State {
  currentUserCred?: UserCredential;
  currentLoggedFireUser?: UserSettings;
  currentUserShifts?: string;
  isEditing: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  activeComponent: string;
  shiftToEdit: Shift | undefined;
  shiftsCount: number;
  searchForm: PipeFilter;
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
}

export interface Shift {
  shiftID: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  workplace: string;
  wagePerHour: string;
  shiftRevenue: string;
  timeStamp: Date;
  [key: string]: any;
  userInfo: {
    firstName: string;
    lastName: string;
  };
}

export interface PipeFilter {
  nameQuery: string;
  startDateQuery: string;
  endDateQuery: string;
  sortByQuery: string;
  orderByQuery: string;
}
