import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';

import { getCurrentYearMonth } from 'src/app/utils/functions';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  styleUrls: ['./all-shifts.component.scss'],
})
export class AllShiftsComponent {
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
  allShifts: Shift[] = [];
  shiftsCount: number = 0;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.getAllShifts();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;

      if (this.currentState.currentUserShifts) {
        this.allShifts = this.currentState.currentUserShifts;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getAllShifts() {
    this.DB.handleGetAllShifts();
  }

  resetFilters() {}

  deleteShift() {}

  editShift() {}
}
