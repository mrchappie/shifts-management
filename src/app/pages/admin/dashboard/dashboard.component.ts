import { Component } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';
import { AggQueriesService } from 'src/app/utils/services/aggQueries/agg-queries.service';
import { CountCardComponent } from '../../../components/count-card/count-card.component';
import { NgFor } from '@angular/common';
import { SectionHeadingComponent } from '../../../components/UI/section-heading/section-heading.component';
import { ChartGroupComponent } from 'src/app/components/chart/chart-group/chart-group.component';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';
import { firestoreConfig } from 'firebase.config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
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
export class DashboardComponent {
  // Comp data
  shiftsCurrentMonth: Shift[] = [];
  statsDateForm!: FormGroup;
  updateCharts: boolean = false;

  protected statsHeadings: string[] = [
    'Total users.',
    'Total shifts.',
    'Total shifts this month.',
  ];

  constructor(
    private fb: FormBuilder,
    private customFN: CustomFnService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.statsDateForm = this.fb.group({
      statsDate: [
        `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}`,
      ],
    });

    this.statsService
      .getStatisticsFromDB([
        firestoreConfig.firestore.statistics.admin,
        'year',
        '2024',
      ])
      .then(() => {
        this.updateCharts = true;
        // this.state.setState({ updateStats: true });
      });
  }
}

export interface CountI {
  label: string;
  value: number;
}
