import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'src/app/components/chart/chart.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Shift } from 'src/app/utils/Interfaces';
import { firestoreConfig } from 'firebase.config';
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

  constructor(
    private firestore: FirestoreService,
    private fb: FormBuilder,
    private customFN: CustomFnService,
    private aggQueries: AggQueriesService
  ) {}

  ngOnInit(): void {
    this.statsDateForm = this.fb.group({
      statsDate: [
        `${this.customFN.getCurrentYear()}-${this.customFN.getCurrentMonth()}-${this.customFN.getCurrentDay()}`,
      ],
    });
  }
}

export interface CountI {
  label: string;
  value: number;
}
