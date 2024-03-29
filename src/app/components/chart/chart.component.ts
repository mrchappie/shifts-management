import { NgIf } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  imports: [NgIf, NgChartsModule],
})
export class ChartComponent {
  // GLOBAL CHART VARIABLES
  @Input() chartType!: ChartType;
  @Input() chartName: string = '';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  //! PIE CHART
  @Input() pieChartData!: any;
  @Input() pieChartOptions!: any;

  //! BAR CHART
  @Input() barChartData!: any;
  @Input() barChartOptions!: any;

  //! LINE CHART
  @Input() lineChartData!: any;
  @Input() lineChartOptions!: any;

  //! POLAR AREA CHART
  @Input() polarAreaChartData!: any;
  @Input() polarAreaChartOptions!: any;

  constructor() {}

  updateChart() {
    this.chart?.update();
  }
}

export interface PieData {
  [key: string]: number[];
}
