import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { Filter, sortShiftsBy, sortUsersBy } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() parent: string = '';

  // html data
  sortBy: Filter[] = sortShiftsBy;
  orderBy: string = 'asc';

  // component data
  allShifts: Shift[] = [];
  shiftsCount: number = 0;

  currentState!: State;
  searchForm!: FormGroup;
  filters?: SearchFilters;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private fb: FormBuilder,
    private DB: HandleDBService
    private DB: HandleDBService,
    private customFN: CustomFnService
  ) {}

  ngOnInit(): void {
    this.sortBy = this.parent != 'all-users' ? sortShiftsBy : sortUsersBy;

    this.searchForm = this.fb.group({
      nameQuery: [''],
      startDateQuery: [''],
      endDateQuery: [''],
      sortByQuery: [''],
      orderByQuery: ['asc'],
      yearMonthQuery: [''],
      queryLimit: [10],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      this.state.setState({ searchForm: value });
    });

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
      this.DB.handleGetShiftsByUserID(
        this.currentState.currentLoggedFireUser!.id,
        limit
      );
    } else if (this.parent === 'all-shifts') {
      this.DB.handleGetAllShifts(limit as number);
    }
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
