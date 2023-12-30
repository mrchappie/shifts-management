import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'src/app/components/chart/chart.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  usersShiftsCountData: CountI[] = [
    { label: 'Total users', value: 10 },
    { label: 'Users this month', value: 10 },
    { label: 'Total shifts', value: 10 },
    { label: 'Shifts this month', value: 10 },
  ];

  chartBorder: any = { borderColor: 'black', borderWidth: 0.5 };

  //! PIE CHART
  @ViewChild('pieChart') pieChart!: ChartComponent;
  public pieChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: ['Shift 1', 'Shift 2', 'Shift 3'],
    datasets: [{ ...this.chartBorder, data: [240, 320, 178] }],
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workplaces by Revenue',
      },
    },
  };

  //! BAR CHART
  @ViewChild('barChart') barChart!: ChartComponent;
  public barChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: ['June', 'July', 'August'],
    datasets: [
      { ...this.chartBorder, data: [3105, 2850, 3805], label: 'Revenue' },
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 3 months by revenue',
      },
    },
  };

  //! LINE CHART
  @ViewChild('lineChart') lineChart!: ChartComponent;
  public lineChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: [
      'June',
      'July',
      'August',
      'September',
      'Octomber',
      'November',
      'December',
    ],
    datasets: [
      {
        ...this.chartBorder,
        data: [20, 25, 14, 18, 22, 30, 10],
        label: 'Shifts',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Shifts per month',
      },
    },
  };

  //! POLAR AREA CHART
  @ViewChild('polarArea') polarArea!: ChartComponent;
  public polarAreaChartData: ChartData<ChartType, number[], string | string[]> =
    {
      labels: [
        'June',
        'July',
        'August',
        'September',
        'Octomber',
        'November',
        'December',
      ],
      datasets: [
        {
          ...this.chartBorder,
          data: [20, 25, 14, 18, 22, 30, 10],
          label: 'Worked hours',
        },
      ],
    };

  public polarAreaChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Worked hours per month',
      },
    },
  };
}

export interface CountI {
  label: string;
  value: number;
}
