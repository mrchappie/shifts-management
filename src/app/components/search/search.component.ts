import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, Shift, State } from 'src/app/utils/Interfaces';
import { Filter, orderBy, sorterBy } from './formData';
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
  sorterBy: Filter[] = sorterBy;
  orderBy: Filter[] = orderBy;

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
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      nameQuery: [''],
      startDateQuery: [''],
      endDateQuery: [''],
      sortByQuery: [''],
      orderByQuery: [''],
      yearMonthQuery: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      this.state.setState({ searchForm: value });
    });

    this.currentState = this.state.getState();

    // setting the default year-month to my form input
    this.searchForm.patchValue({
      yearMonthQuery: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }`,
    });

    this.shiftsCount = this.currentState.shiftsCount;
    this.filters = this.currentState.searchForm;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.shiftsCount = this.currentState.shiftsCount;
      this.filters = this.currentState.searchForm;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  getShiftsByDate() {
    if (this.parent === 'my-shifts') {
      this.DB.handleGetShifts(this.currentState.currentLoggedFireUser!.id);
    } else if (this.parent === 'all-shifts') {
      this.DB.handleGetAllShifts();
    }
  }

  resetFilters() {
    this.searchForm.patchValue(defaultFormValues);

    this.state.setState({
      searchForm: defaultFormValues,
    });

    this.getShiftsByDate();
  }
}

export const defaultFormValues = {
  nameQuery: '',
  startDateQuery: '',
  endDateQuery: '',
  sortByQuery: '',
  orderByQuery: '',
  yearMonthQuery: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
};
