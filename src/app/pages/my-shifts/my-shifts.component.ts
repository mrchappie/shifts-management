import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Router, RouterLink } from '@angular/router';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { firestoreConfig } from 'firebase.config';
import { CustomShiftsSortPipe } from '../../utils/pipes/customSort/custom-shifts-sort.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ShiftCardComponent } from '../../components/shift-card/shift-card.component';
import { NgIf, NgFor } from '@angular/common';
import { NewSearchComponent } from '../../components/search/search.component';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { UpdateStatsService } from '../handle-shifts/updateStatsService/update-stats.service';
import { ShiftCardRectComponent } from 'src/app/components/shift-card/shift-card-rect/shift-card-rect.component';
import { ShiftsService } from 'src/app/utils/services/shifts/shifts.service';
import { getMonthStartToEnd } from 'src/app/components/search/helpers';
import { InlineSpinnerService } from 'src/app/utils/services/spinner/inline-spinner.service';
import { InlineSpinnerComponent } from 'src/app/components/spinner/inline-spinner/inline-spinner.component';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  standalone: true,
  imports: [
    NewSearchComponent,
    NgIf,
    RouterLink,
    NgFor,
    ShiftCardComponent,
    ShiftCardRectComponent,
    MatIconModule,
    CustomShiftsSortPipe,
    InlineSpinnerComponent,
  ],
})
export class MyShiftsComponent implements OnInit, OnDestroy {
  @Input() parent: string = 'my-shifts';
  @Input() userIDFromURL: string = '';
  @Input() isAdminPath: boolean = false;

  // filters
  filters: SearchFilters = {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: 'shiftDate',
    orderByQuery: 'dsc',
    yearMonthQuery: '',
    queryLimit: 10,
  };

  // component data
  currentState!: State;
  userID: string = '';
  myShifts: Shift[] = [];
  shiftsCount: number = 0;
  toggleSpinner!: boolean;

  private stateSubscription: Subscription | undefined;

  constructor(
    private firestore: FirestoreService,
    private state: StateService,
    private router: Router,
    private toast: ToastService,
    private updateStats: UpdateStatsService,
    private shiftsService: ShiftsService,
    private inlineSpinner: InlineSpinnerService
  ) {}

  ngOnInit(): void {
    // init inline loading spinner
    this.inlineSpinner.spinnerState.subscribe((spinnerState) => {
      this.toggleSpinner = spinnerState;
    });

    this.currentState = this.state.getState();
    this.filters = this.currentState.searchForm;

    this.shiftsService.shifts.subscribe((value) => {
      this.myShifts = value;
    });

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;
    });

    // fetch shifts for single user
    if (!this.userIDFromURL && this.parent === 'my-shifts') {
      const queryDate = getMonthStartToEnd(
        this.filters.yearMonthQuery as string
      );

      this.userID = this.currentState.currentLoggedFireUser!.id;
      this.shiftsService.getShiftsByMultipleQueries(
        this.userID,
        this.filters.queryLimit,
        queryDate.start,
        queryDate.end
      );
    }
    // fetch shifts when an admin loads a user edit page
    if (this.userIDFromURL && this.parent === 'edit-user') {
      const queryDate = getMonthStartToEnd(
        this.filters.yearMonthQuery as string
      );

      this.shiftsService.getShiftsByMultipleQueries(
        this.userIDFromURL,
        this.filters.queryLimit,
        queryDate.start,
        queryDate.end
      );
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async editShift(shift: Shift) {
    // handle navigation depending from where the function is called
    if (this.parent === 'my-shifts') {
      this.router.navigate(['my-shifts/edit-shift'], {
        queryParams: { shiftID: shift.shiftID },
      });
    }
    if (this.parent === 'all-shifts' && this.isAdminPath) {
      this.router.navigate(['admin/all-shifts/edit-shift'], {
        queryParams: { userID: shift.userID, shiftID: shift.shiftID },
      });
    }
    if (this.parent === 'edit-user' && this.isAdminPath) {
      this.router.navigate(['admin/all-users/edit-user-shift'], {
        queryParams: { userID: shift.userID, shiftID: shift.shiftID },
        queryParamsHandling: 'merge',
      });
    }
  }

  deleteShift(shift: Shift) {
    try {
      this.firestore.deleteFirestoreDoc(
        firestoreConfig.firestore.shiftsDB.base,
        [firestoreConfig.firestore.shiftsDB.shifts, shift.userID, shift.shiftID]
      );

      this.updateStats.deleteShiftStats(
        this.currentState.currentLoggedFireUser!.id,
        shift
      );

      this.toast.success(successMessages.firestore.shift.delete);

      this.myShifts = this.myShifts.filter(
        (existingShift) => existingShift.shiftID != shift.shiftID
      );
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }
}
