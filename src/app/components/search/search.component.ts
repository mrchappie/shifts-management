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
import { defaultFormValues, getMonthStartToEnd } from './helpers';
import { ShiftsService } from 'src/app/utils/services/shifts/shifts.service';

@Component({
  standalone: true,
  selector: 'app-new-search',
  templateUrl: './search.component.html',
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, NgFor, NgIf],
})
export class NewSearchComponent implements OnInit, OnDestroy {
  @Input() userID: string = '';
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
    private customFN: CustomFnService,
    private shiftsService: ShiftsService
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
      userNames: [this.userID],
      startDateQuery: [''],
      endDateQuery: [''],
      sortByQuery: [`${this.parent != 'all-users' ? 'shiftDate' : 'name'}`],
      orderByQuery: ['dsc'],
      yearMonthQuery: [''],
      queryLimit: [10],
    });

    // set default sort order icon
    this.orderBy = this.searchForm.get('orderByQuery')?.value;

    this.searchForm.valueChanges.subscribe((value) => {
      this.state.setState({ searchForm: value });
    });

    // setting the default year-month to my form input
    this.searchForm.patchValue({
      yearMonthQuery: `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}`,
    });

    // // fetch shifts by query limit
    // this.searchForm.get('queryLimit')?.valueChanges.subscribe(() => {
    //   this.getShiftsByDate();
    // });
    // // fetch shifts by month and year
    // this.searchForm.get('yearMonthQuery')?.valueChanges.subscribe(() => {
    //   this.getShiftsByDate();
    // });

    // fetch shifts by user
    this.searchForm
      .get('userNames')
      ?.valueChanges.subscribe((value: string) => {
        // console.log(value);
        if (value) {
          this.shiftsService.getAllShifts(
            value,
            this.searchForm.get('queryLimit')?.value
          );
          this.userID = value;
        }
      });

    // update the state after all default inputs init
    this.state.setState({ searchForm: this.searchForm.value });

    this.filters = this.currentState.searchForm;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;
    });

    if (this.parent === 'all-shifts') {
      this.shiftsService.getAllShifts(
        this.userID,
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

  async getShiftsByDate() {
    const limit = this.searchForm.get('queryLimit')?.value;
    const date = this.searchForm.get('yearMonthQuery')?.value;

    const queryDate = getMonthStartToEnd(date as string);
    if (this.parent === 'my-shifts') {
      await this.shiftsService.getShiftsByMultipleQueries(
        this.userID,
        limit,
        queryDate.start,
        queryDate.end
      );
    }
  }

  searchShiftsByWorkplace() {
    const query: string = this.searchForm.get('nameQuery')?.value;
    if (query != '') {
      this.shiftsService.getShiftsByWorkplace(this.userID, query.toLowerCase());
    }
  }

  // reset filter to default value but keeps the selected user
  // shifts after reset will be for selected user
  resetFilters() {
    const shiftsDate = getMonthStartToEnd(
      this.filters!.yearMonthQuery as string
    );
    this.searchForm.patchValue(defaultFormValues(this.parent));

    this.state.setState({
      searchForm: defaultFormValues(this.parent),
    });

    this.shiftsService.getShiftsByUserID(
      this.userID,
      this.filters!.queryLimit,
      shiftsDate.start,
      shiftsDate.end
    );
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

  searchByYearMonth() {
    const shiftsDate = getMonthStartToEnd(
      this.filters!.yearMonthQuery as string
    );

    this.shiftsService.getShiftsByMultipleQueries(
      this.userID,
      this.filters!.queryLimit,
      shiftsDate.start,
      shiftsDate.end
    );
  }

  searchByPeriod() {
    const startDate = new Date(this.filters!.startDateQuery).getTime();
    const endDate = new Date(this.filters!.endDateQuery).getTime();

    this.shiftsService.getShiftsByMultipleQueries(
      this.userID,
      this.filters!.queryLimit,
      startDate,
      endDate
    );
  }
}
