import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() pieChartLabels: string[] = [];
  // check type
  @Input() pieChartDatasets: any[] = [];
  @Input() chartName: string = '';

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Workplaces by Revenue',
      },
    },
  };

  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {}
}

export interface PieData {
  [key: string]: number[];
}
