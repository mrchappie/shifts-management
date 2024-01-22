import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shift, State } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';
import { NgFor } from '@angular/common';
import { SectionHeadingComponent } from '../../components/UI/section-heading/section-heading.component';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';
import { ChartGroupComponent } from 'src/app/components/chart/chart-group/chart-group.component';
import {
  Statistics,
  defaultStatsObject,
} from 'src/app/utils/services/statistics/defaultStatsObject';
import { firestoreConfig } from 'firebase.config';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [
    SectionHeadingComponent,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    ChartGroupComponent,
  ],
})
export class HomepageComponent {
  // Comp Data
  currentState!: State;
  loggedUserID!: string;
  userShifts: Shift[] = [];
  statsDateForm!: FormGroup;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
    private fb: FormBuilder,
    private customFN: CustomFnService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.loggedUserID = this.currentState.currentLoggedFireUser!.id;

    this.statsDateForm = this.fb.group({
      statsDate: [
        `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}-${this.customFN.getCurrentDay()}`,
      ],
    });

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.loggedUserID = this.currentState.currentLoggedFireUser!.id;
    });

    if (this.currentState.updateStats) {
      this.statsService.updateStatistics();
      this.state.setState({ updateStats: false });
    }

    // this.firestore.setFirestoreDoc(
    //   'statistics',
    //   ['admin', 'year', '2024'],
    //   defaultStatsObject
    // );

    // this.statsService.updateUserStatistics();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
