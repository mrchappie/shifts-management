import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ChartComponent } from '../chart.component';
import { Statistics } from 'src/app/utils/services/statistics/defaultStatsObject';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';
import { CountCardComponent } from '../../count-card/count-card.component';
import { NgFor } from '@angular/common';
import { sortByMonth, sortByValue } from '../helpers';

@Component({
  standalone: true,
  selector: 'app-chart-group',
  templateUrl: './chart-group.component.html',
  imports: [ChartComponent, CountCardComponent, NgFor],
})
export class ChartGroupComponent {
  @Input() setUpdateCharts!: boolean;
  @Input() statsHeadings!: string[];

  statistics!: Statistics;

  constructor(private statsService: StatisticsService) {}

  //? INIT CHARTS DATA
  chartBorder: any = { borderColor: 'black', borderWidth: 0.5 };
  // //! PIE CHART
  @ViewChild('pieChart') pieChart!: ChartComponent;
  public pieChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: ['Test'],
    datasets: [{ ...this.chartBorder, data: [100], label: 'Revenue' }],
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workplaces by revenue - Top 5 this month',
      },
    },
  };

  // //! BAR CHART
  @ViewChild('barChart') barChart!: ChartComponent;
  public barChartData: ChartData<ChartType, number[], string | string[]> = {
    // prettier-ignore
    labels: [
      "january","february","march","april","may","june","july",
    "august", "september", "october", "november", "december"
    ],
    datasets: [
      {
        ...this.chartBorder,
        data: [20, 25, 14, 18, 22, 30, 15, 14, 18, 22, 30, 10],
        label: 'Revenue',
      },
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
        text: 'Revenue per month',
      },
    },
  };

  // //! LINE CHART
  @ViewChild('lineChart') lineChart!: ChartComponent;
  public lineChartData: ChartData<ChartType, number[], string | string[]> = {
    // prettier-ignore
    labels: [
      "january","february","march","april","may","june","july",
    "august", "september", "october", "november", "december"
    ],
    datasets: [
      {
        ...this.chartBorder,
        data: [20, 25, 14, 18, 22, 30, 15, 14, 18, 22, 30, 10],
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

  // //! POLAR AREA CHART
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
        text: 'Worked hours by workplace - Top 5 this month',
      },
    },
  };

  ngOnInit(): void {
    this.statsService.statistics.subscribe((value) => {
      this.statistics = value;
      console.log('on_init', this.statistics);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.setUpdateCharts && this.setUpdateCharts === true) {
      this.updateCharts();
    }
  }

  updateCharts() {
    //? PIE CHART
    this.pieChartData.labels = sortByValue(
      this.statistics.statsPerMonth.earnedRevenueByShift.january
    ).labels;
    this.pieChartData.datasets[0].data = sortByValue(
      this.statistics.statsPerMonth.earnedRevenueByShift.january
    ).data;
    this.pieChart.updateChart();

    //? BAR CHART
    this.barChartData.labels = sortByMonth(
      this.statistics.earnedRevenueByMonth
    ).labels;
    this.barChartData.datasets[0].data = sortByMonth(
      this.statistics.earnedRevenueByMonth
    ).data;
    this.barChart.updateChart();

    //? LINE CHART
    this.lineChartData.labels = sortByMonth(
      this.statistics.shiftCountByMonth
    ).labels;
    this.lineChartData.datasets[0].data = sortByMonth(
      this.statistics.shiftCountByMonth
    ).data;
    this.lineChart.updateChart();

    //? POLAR CHART
    this.polarAreaChartData.labels = sortByValue(
      this.statistics.statsPerMonth.workedHoursByShift.january
    ).labels;
    this.polarAreaChartData.datasets[0].data = sortByValue(
      this.statistics.statsPerMonth.workedHoursByShift.january
    ).data;
    this.polarArea.updateChart();
  }
}
