import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PipeFilter, Shift, State } from 'src/app/utils/Interfaces';
import { Filter, orderBy, sorterBy } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  filters?: PipeFilter;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      nameQuery: [''],
      startDateQuery: [''],
      endDateQuery: [''],
      sortByQuery: [''],
      orderByQuery: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      this.state.setState({ searchForm: value });
    });

    this.currentState = this.state.getState();
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

  resetFilters() {
    this.searchForm.patchValue({
      nameQuery: '',
      startDateQuery: '',
      endDateQuery: '',
      sortByQuery: '',
      orderByQuery: '',
    });
  }
}
