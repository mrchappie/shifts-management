import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, State } from 'src/app/utils/Interfaces';
import { Filter, UsersSelect, sortShiftsBy, sortUsersBy } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { firestoreConfig } from 'firebase.config';

@Component({
  standalone: true,
  selector: 'app-new-search',
  templateUrl: './search.component.html',
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, NgFor, NgIf],
})
export class NewSearchComponent implements OnInit, OnDestroy {
  @Input() parent: string = '';

  // html data
  sortBy: Filter[] = sortShiftsBy;
  orderBy: string = '';
  userNames: UsersSelect[] = [];

  currentState!: State;
  searchForm!: FormGroup;
  filters?: SearchFilters;
  showMoreFilters: boolean = false;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private fb: FormBuilder,
    private firestore: FirestoreService,
    private customFN: CustomFnService
  ) {}

  ngOnInit(): void {
    // init state
    this.currentState = this.state.getState();
    // init all shifts users options
    if (this.parent === 'all-shifts') {
      this.initUsersSearchOptions();
    }
    // init sorting options
    this.sortBy = this.parent != 'all-users' ? sortShiftsBy : sortUsersBy;

    this.searchForm = this.fb.group({
      nameQuery: [''],
      userNames: [this.currentState.currentLoggedFireUser?.id],
      startDateQuery: [''],
      endDateQuery: [''],
      sortByQuery: [`${this.parent === 'all-users' ? 'name' : 'shiftDate'}`],
      orderByQuery: ['dsc'],
      yearMonthQuery: [''],
      queryLimit: [10],
    });

    // set default sort order icon
    this.orderBy = this.searchForm.get('orderByQuery')?.value;

    this.searchForm.valueChanges.subscribe((value) => {
      this.state.setState({ searchForm: value });
    });

    // fetch shifts by query limit
    this.searchForm
      .get('queryLimit')
      ?.valueChanges.subscribe((value: number) => {
        this.getShiftsByDate(value);
      });

    // fetch shifts by user
    this.searchForm
      .get('userNames')
      ?.valueChanges.subscribe((value: string) => {
        console.log(value);
        if (value) {
          this.getAllShifts(value, this.searchForm.get('queryLimit')?.value);
        }
      });

    // setting the default year-month to my form input
    this.searchForm.patchValue({
      yearMonthQuery: `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}`,
    });
    this.filters = this.currentState.searchForm;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;
    });

    if (this.currentState.shifts.length === 0 && this.parent === 'all-shifts') {
      this.getAllShifts(
        this.currentState.currentLoggedFireUser!.id,
        this.searchForm.get('queryLimit')?.value
      );
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  // fetching users info from DB
  async initUsersSearchOptions() {
    const tempArr = (await this.firestore.getFirestoreDoc(
      firestoreConfig.firestore.shiftsDB.base,
      [firestoreConfig.firestore.shiftsDB.usernames]
    )) as {
      info: { userID: string; firstName: string; lastName: string }[];
    };

    this.userNames.push(...tempArr.info);
  }

  getShiftsByDate(limit: number) {
    if (this.parent === 'my-shifts') {
      this.firestore.handleGetShiftsByUserID(
        this.currentState.currentLoggedFireUser!.id,
        limit
      );
    } else if (this.parent === 'all-shifts') {
      // this.firestore.handleGetAllShifts(limit as number);
    }
  }

  async getAllShifts(userID: string, queryLimit: number) {
    await this.firestore.handleGetAllShifts(userID, queryLimit);
  }

  searchShiftsByWorkplace() {
    const query: string = this.searchForm.get('nameQuery')?.value;
    this.firestore.handleGetShiftsBySearch(
      this.currentState.currentLoggedFireUser!.id,
      query.toLowerCase()
    );
  }

  resetFilters() {
    this.searchForm.patchValue(defaultFormValues);

    this.state.setState({
      searchForm: defaultFormValues,
    });

    this.getShiftsByDate(10);
  }

  changeSortOrder() {
    if (this.orderBy === 'asc') {
      this.orderBy = 'dsc';
      this.searchForm.patchValue({ orderByQuery: 'dsc' });
    } else {
      this.orderBy = 'asc';
      this.searchForm.patchValue({ orderByQuery: 'asc' });
    }
  }

  toggleMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
  }
}

export const defaultFormValues = {
  nameQuery: '',
  startDateQuery: '',
  endDateQuery: '',
  sortByQuery: '',
  orderByQuery: '',
  yearMonthQuery: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, '0')}`,
  queryLimit: 10,
};
