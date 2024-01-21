import { Component } from '@angular/core';
import { FirebaseConfigI, firestoreConfig } from 'firebase.config';
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
import {
  Statistics,
  StatisticsService,
} from 'src/app/utils/services/statistics/statistics.service';
import { CountCardComponent } from 'src/app/components/count-card/count-card.component';
import { ChartGroupComponent } from 'src/app/components/chart/chart-group/chart-group.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [
    SectionHeadingComponent,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    CountCardComponent,
    ChartGroupComponent,
  ],
})
export class HomepageComponent {
  // Comp Data
  currentState!: State;
  loggedUserID!: string;
  userShifts: Shift[] = [];
  statsDateForm!: FormGroup;
  statistics!: Statistics;

  // firestore Config
  fbConfig: FirebaseConfigI = firestoreConfig;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
    private fb: FormBuilder,
    private customFN: CustomFnService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.statsService.statistics.subscribe((value) => {
      this.statistics = value;
    });
    console.log(this.statistics);

    this.currentState = this.state.getState();
    this.loggedUserID = this.currentState.currentLoggedFireUser!.id;

    this.statsDateForm = this.fb.group({
      statsDate: [
        `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}-${this.customFN.getCurrentDay()}`,
      ],
    });

    this.updateStatistics();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.loggedUserID = this.currentState.currentLoggedFireUser!.id;
    });
  }

  async updateStatistics() {
    const stats = await this.firestore.getFirestoreDoc('statistics', [
      'users',
      '2024',
      this.currentState.currentLoggedFireUser!.id,
    ]);

    this.statsService.setStatistics(stats as Statistics);
    // this.updateCharts();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  // updateCharts() {
  //   //? PIE CHART
  //   this.pieChartData.labels = Object.keys(
  //     this.statistics.statsPerMonth.january.earnedRevenueByShift
  //   );
  //   this.pieChartData.datasets[0].data = Object.values(
  //     this.statistics.statsPerMonth.january.earnedRevenueByShift
  //   );
  //   this.pieChart.updateChart();

  //   //? BAR CHART
  //   this.barChartData.labels = Object.keys(
  //     this.statistics.earnedRevenueByMonth
  //   );
  //   this.barChartData.datasets[0].data = Object.values(
  //     this.statistics.earnedRevenueByMonth
  //   );
  //   this.barChart.updateChart();

  //   //? LINE CHART
  //   this.lineChartData.labels = Object.keys(this.statistics.shiftCountByMonth);
  //   this.lineChartData.datasets[0].data = Object.values(
  //     this.statistics.shiftCountByMonth
  //   );
  //   this.lineChart.updateChart();

  //   //? POLAR CHART
  //   this.polarAreaChartData.labels = Object.keys(
  //     this.statistics.statsPerMonth.january.workedHoursByShift
  //   );
  //   this.polarAreaChartData.datasets[0].data = Object.values(
  //     this.statistics.statsPerMonth.january.workedHoursByShift
  //   );
  //   this.polarArea.updateChart();
  // }
}
