import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Router } from '@angular/router';
import {
  SearchFilters,
  Shift,
  State,
  UserSettings,
} from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.scss'],
})
export class MyShiftsComponent implements OnInit, OnDestroy {
  @Input() parent: string = 'single_user';
  @Input() userIDFromURL: string = '';
  @Input() isAdminPath: boolean = false;

  // filters
  filters: SearchFilters = {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
    yearMonthQuery: '',
    queryLimit: 10,
  };

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  // component data
  currentState!: State;
  myShifts: Shift[] = [];
  shiftsCount: number = 0;

  private stateSubscription: Subscription | undefined;

  constructor(
    private DB: HandleDBService,
    private state: StateService,
    private router: Router,
    private customFN: CustomFnService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    // this.getShifts(this.currentState.currentLoggedFireUser!.id);

    // if (this.currentState.shifts) {
    //   this.myShifts = this.currentState.shifts;
    // }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;

      // if (this.currentState.shifts) {
      //   this.myShifts = this.currentState.shifts;
      // }
    });

    if (!this.userIDFromURL && this.parent === 'single_user') {
      const userID = this.currentState.currentLoggedFireUser!.id;
      this.getShifts(userID);
    } else if (this.userIDFromURL) {
      this.getShifts(this.userIDFromURL);
      this.getEditedUserData(this.userIDFromURL);
    } else {
      this.getAllShifts(this.filters.queryLimit);
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getShifts(userID: string) {
    this.myShifts = await this.DB.handleGetShiftsByUserID(userID);
  }

  async getAllShifts(queryLimit: number) {
    this.myShifts = await this.DB.handleGetAllShifts(queryLimit);
  }

  async getEditedUserData(userID: string) {
    const data = (await this.DB.getFirestoreDoc(firebaseConfig.dev.usersDB, [
      userID,
    ])) as UserSettings;

    this.currentState.editedUserData = data;
  }

  async editShift(shiftID: string, userID: string) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    this.currentState.shiftToEdit = (await this.DB.getFirestoreDoc(
      this.fbConfig.dev.shiftsDB,
      [currentYear, currentMonth, shiftID]
    )) as Shift;

    if (this.parent === 'all-shifts') {
      this.getEditedUserData(userID);
    }

    this.router.navigate([
      `${
        this.isAdminPath
          ? this.parent === 'all-shifts'
            ? `admin/all-shifts/edit-shift/${shiftID}`
            : `admin/all-users/edit-user/${this.userIDFromURL}/edit-shift/${shiftID}`
          : `my-shifts/edit-shift/${shiftID}`
      }`,
    ]);
  }

  deleteShift(shiftID: string) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    this.DB.deleteFirestoreDoc(this.fbConfig.dev.shiftsDB, [
      currentYear,
      currentMonth,
      shiftID,
    ]);

    this.myShifts = this.myShifts.filter((shift) => shift.shiftID != shiftID);
  }
}
