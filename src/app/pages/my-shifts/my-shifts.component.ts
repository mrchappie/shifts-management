import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Router, RouterLink } from '@angular/router';
import {
  SearchFilters,
  Shift,
  State,
  UserSettings,
} from 'src/app/utils/Interfaces';
import { firestoreConfig } from 'firebase.config';
import { CustomShiftsSortPipe } from '../../utils/pipes/customSort/custom-shifts-sort.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ShiftCardComponent } from '../../components/shift-card/shift-card.component';
import { NgIf, NgFor } from '@angular/common';
import { NewSearchComponent } from '../../components/search/search.component';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';

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
  @Input() parent: string = 'single_user';
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
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();

    // fetch shifts based on opened page - All Shifts / Single User Shifts / Edit User Info
    if (!this.userIDFromURL && this.parent === 'single_user') {
      this.userID = this.currentState.currentLoggedFireUser!.id;
      this.getShifts(this.userID, this.filters.queryLimit);
    } else if (this.userIDFromURL) {
      this.getShifts(this.userIDFromURL, this.filters.queryLimit);
      this.getEditedUserData(this.userIDFromURL);
    } else {
      this.getAllShifts(this.filters.queryLimit);
    }

    if (this.currentState.shifts) {
      this.myShifts = this.currentState.shifts;
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
      userID,
      queryLimit
    );
  }

  async getAllShifts(queryLimit: number) {
    this.myShifts = await this.firestore.handleGetAllShifts(queryLimit);
  }

  async getEditedUserData(userID: string) {
    const data = (await this.firestore.getFirestoreDoc(
      firestoreConfig.dev.usersDB,
      [userID]
    )) as UserSettings;

    this.currentState.editedUserData = data;
  }

  async editShift(shift: Shift) {
    this.currentState.shiftToEdit = (await this.firestore.getFirestoreDoc(
      firestoreConfig.dev.shiftsDB.base,
      [firestoreConfig.dev.shiftsDB.subColl, this.userID, shift.shiftID]
    )) as Shift;

    if (this.parent === 'edit-user') {
      this.getEditedUserData(shift.userID);
    }

    this.router.navigate([
      `${
        this.isAdminPath
          ? this.parent === 'all-shifts'
            ? `admin/all-shifts/edit-shift/${shift.shiftID}`
            : `admin/all-users/edit-user/${this.userIDFromURL}/edit-shift/${shift.shiftID}`
          : `my-shifts/edit-shift/${shift.shiftID}`
      }`,
    ]);
  }

  deleteShift(shift: Shift) {
    try {
      this.firestore.deleteFirestoreDoc(firestoreConfig.dev.shiftsDB.base, [
        firestoreConfig.dev.shiftsDB.subColl,
        shift.userID,
        shift.shiftID,
      ]);

      this.toast.success(successMessages.firestore.shift.delete);

      this.myShifts = this.myShifts.filter(
        (existingShift) => existingShift.shiftID != shift.shiftID
      );
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }
}
