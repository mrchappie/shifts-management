import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shift, State } from 'src/app/utils/Interfaces';
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
import { firestoreConfig } from 'firebase.config';

@Component({
  standalone: true,
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
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
  updateCharts: boolean = false;

  private stateSubscription: Subscription | undefined;
  protected statsHeading: string[] = [
    'Total shifts this year',
    'Total shifts this month',
    'Best month',
    'Best job',
  ];

  constructor(
    private state: StateService,
    private fb: FormBuilder,
    private customFN: CustomFnService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.loggedUserID = this.currentState.currentLoggedFireUser!.id;

    this.statsDateForm = this.fb.group({
      statsDate: [
        `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}`,
      ],
    });

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.loggedUserID = this.currentState.currentLoggedFireUser!.id;
    });

    const dateFromUser: string[] = this.statsDateForm
      .get('statsDate')
      ?.value.split('-');

    this.statsDateForm.get('statsDate')?.valueChanges.subscribe((newValue) => {
      const [yearFromUser, monthFromUser] = newValue.split('-');
      const currentYear = new Date().getFullYear().toString();
      this.updateCharts = false;
      if (yearFromUser != currentYear) {
        this.statsService
          .getStatisticsFromDB([
            firestoreConfig.firestore.statistics.users,
            yearFromUser,
            this.currentState.currentLoggedFireUser!.id,
          ])
          .then(() => {
            this.updateCharts = true;
          });
      }
    });

    this.statsService
      .getStatisticsFromDB([
        firestoreConfig.firestore.statistics.users,
        dateFromUser[0],
        this.currentState.currentLoggedFireUser!.id,
      ])
      .then(() => {
        this.updateCharts = true;
      });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
