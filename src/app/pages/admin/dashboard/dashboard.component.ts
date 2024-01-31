import { Component } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomFnService } from 'src/app/utils/services/customFn/custom-fn.service';
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

  protected statsHeading: string[] = [
    'Total users this year',
    'Total shifts this year',
    'Best month',
    'Best job this month',
  ];

  // 'Total shifts this month',
  // 'Best Worker',
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
            firestoreConfig.firestore.statistics.admin,
            'year',
            yearFromUser,
          ])
          .then(() => {
            this.updateCharts = true;
          });
      }
    });

    this.statsService
      .getStatisticsFromDB([
        firestoreConfig.firestore.statistics.admin,
        'year',
        dateFromUser[0],
      ])
      .then(() => {
        this.updateCharts = true;
      });
  }
}

export interface CountI {
  label: string;
  value: number;
}
