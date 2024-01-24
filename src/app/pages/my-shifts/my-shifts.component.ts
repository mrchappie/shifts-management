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
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';

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
    MatIconModule,
    CustomShiftsSortPipe,
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

  private stateSubscription: Subscription | undefined;

  constructor(
    private firestore: FirestoreService,
    private state: StateService,
    private router: Router,
    private toast: ToastService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();

    // fetch shifts for single user
    if (!this.userIDFromURL && this.parent === 'my-shifts') {
      this.userID = this.currentState.currentLoggedFireUser!.id;
      this.getShifts(this.userID, this.filters.queryLimit);
    }
    // fetch shifts when an admin loads a user edit page
    if (this.userIDFromURL && this.parent === 'edit-user') {
      this.getShifts(this.userIDFromURL, this.filters.queryLimit);
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;

      if (this.currentState.shifts) {
        this.myShifts = this.currentState.shifts;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getShifts(userID: string, queryLimit: number) {
    this.myShifts = await this.firestore.handleGetShiftsByUserID(
      !this.userIDFromURL ? userID : this.userIDFromURL,
      queryLimit
    );
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
      this.firestore.deleteFirestoreDoc(firestoreConfig.dev.shiftsDB.base, [
        firestoreConfig.dev.shiftsDB.shiftsSubColl,
        shift.userID,
        shift.shiftID,
      ]);

      // update statistics in DB if a new shift is added
      this.statsService.updateUserStatistics(
        ['shiftCountByMonth', 'january'],
        1,
        'subtract',
        'shift',
        this.currentState.currentLoggedFireUser!.id
      );
      this.statsService.updateUserStatistics(
        ['totalShifts'],
        1,
        'subtract',
        'totalShifts',
        this.currentState.currentLoggedFireUser!.id
      );
      this.statsService.updateUserStatistics(
        ['earnedRevenueByMonth', 'january'],
        shift.shiftRevenue,
        'subtract',
        'revenue',
        this.currentState.currentLoggedFireUser!.id
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
