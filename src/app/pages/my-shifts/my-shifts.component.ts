import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Router } from '@angular/router';
import { PipeFilter, Shift, State } from 'src/app/utils/Interfaces';
import { getCurrentYearMonth } from 'src/app/utils/functions';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.scss'],
})
export class MyShiftsComponent implements OnInit, OnDestroy {
  @Input() userIDFromURL: string = '';

  // filters
  filters: PipeFilter = {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.shiftsCount = this.currentState.shiftsCount;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.shiftsCount = this.currentState.shiftsCount;
      this.filters = this.currentState.searchForm;
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
    const [currentYear, currentMonth] = getCurrentYearMonth();
    this.myShifts = await this.DB.getFirestoreDocsByQuery(
      this.fbConfig.deploy.shiftsDB,
      [currentYear, currentMonth],
      userID
    );

    if (this.myShifts) {
      this.shiftsCount = this.myShifts.length;
      this.DB.setLocalStorage('loggedUserShifts', this.myShifts);
    }
  }

  async editShift(shiftID: string) {
    const [currentYear, currentMonth] = getCurrentYearMonth();

    this.currentState.shiftToEdit = (await this.DB.getFirestoreDoc(
      this.fbConfig.deploy.shiftsDB,
      [currentYear, currentMonth, shiftID]
    )) as Shift;

    this.router.navigate([`edit-shift/${shiftID}`]);
  }

  deleteShift(shiftID: string) {
    const [currentYear, currentMonth] = getCurrentYearMonth();

    this.DB.deleteFirestoreDoc(this.fbConfig.deploy.shiftsDB, [
      currentYear,
      currentMonth,
      shiftID,
    ]);

    this.myShifts = this.myShifts.filter((shift) => shift.shiftID != shiftID);
  }
}
