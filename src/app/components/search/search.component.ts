import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { Filter, sortShiftsBy, sortUsersBy } from './formData';
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

  // component data
  allShifts: Shift[] = [];
  shiftsCount: number = 0;

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
    this.sortBy = this.parent != 'all-users' ? sortShiftsBy : sortUsersBy;

    this.searchForm = this.fb.group({
      nameQuery: [''],
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

    this.currentState = this.state.getState();

    // setting the default year-month to my form input
    this.searchForm.patchValue({
      yearMonthQuery: `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}`,
    });
    this.filters = this.currentState.searchForm;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  getShiftsByDate(limit: number) {
    if (this.parent === 'my-shifts') {
      this.firestore.handleGetShiftsByUserID(
        this.currentState.currentLoggedFireUser!.id,
        limit
      );
    } else if (this.parent === 'all-shifts') {
      this.firestore.handleGetAllShifts(limit as number);
    }
  }

  searchShiftsByWorkplace() {
    const query: string = this.searchForm.get('nameQuery')?.value;
    this.firestore.handleGetShiftsBySearch(query.toLowerCase());
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
