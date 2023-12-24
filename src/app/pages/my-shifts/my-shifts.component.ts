import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Router } from '@angular/router';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.scss'],
})
export class MyShiftsComponent implements OnInit, OnDestroy {
  @Input() userIDFromURL: string = '';

  // filters
  filters: SearchFilters = {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
    yearMonthQuery: '',
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
    this.getShifts(this.currentState.currentLoggedFireUser!.id);

    if (this.currentState.currentUserShifts) {
      this.myShifts = this.currentState.currentUserShifts;
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;

      if (this.currentState.currentUserShifts) {
        this.myShifts = this.currentState.currentUserShifts;
      }
    });

    if (!this.userIDFromURL) {
      const userID = this.currentState.currentLoggedFireUser!.id;
      this.getShifts(userID);
    } else {
      this.getShifts(this.userIDFromURL);
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getShifts(userID: string) {
    this.DB.handleGetShifts(userID);
  }

  async editShift(shiftID: string) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    this.currentState.shiftToEdit = (await this.DB.getFirestoreDoc(
      this.fbConfig.dev.shiftsDB,
      [currentYear, currentMonth, shiftID]
    )) as Shift;

    this.router.navigate([`edit-shift/${shiftID}`]);
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
