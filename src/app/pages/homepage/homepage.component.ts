import { Component, ViewChild } from '@angular/core';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { Subscription } from 'rxjs';
import { Shift, State } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { CountI } from '../admin/dashboard/dashboard.component';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ChartComponent } from 'src/app/components/chart/chart.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  shiftsCountData: CountI[] = [
    { label: 'Total shifts', value: 0 },
    { label: 'Shifts this month', value: 0 },
    { label: 'Shifts last week', value: 0 },
    { label: 'Shifts this week', value: 0 },
    { label: 'Shifts next week', value: 0 },
  ];

  chartBorder: any = { borderColor: 'black', borderWidth: 0.5 };

  //! PIE CHART
  @ViewChild('pieChart') pieChart!: ChartComponent;
  public pieChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: [],
    datasets: [{ ...this.chartBorder, data: [] }],
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

  // Comp Data
  currentState!: State;
  loggedUserID!: string;
  userShifts: Shift[] = [];

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.loggedUserID = this.currentState.currentLoggedFireUser!.id;

    // above charts stats
    const data = this.currentState.currentLoggedFireUser!.shiftsCount;
    this.shiftsCountData[0].value = data.totalShifts;
    this.shiftsCountData[2].value = data.lastWeek;
    this.shiftsCountData[3].value = data.thisWeek;
    this.shiftsCountData[4].value = data.nextWeek;

    // Charts
    (async () => {
      this.userShifts = await this.DB.handleGetShiftsByUserID(
        this.loggedUserID
      );

      this.handlePieChartData();
    })();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.loggedUserID = this.currentState.currentLoggedFireUser!.id;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  handlePieChartData() {
    const shiftsToFilter = structuredClone(this.userShifts);

    const dataForChart: { [key: string]: number } = {};

    shiftsToFilter.map((shift: Shift) => {
      if (dataForChart[shift.workplace]) {
        dataForChart[shift.workplace] += Number(shift.shiftRevenue);
      } else {
        dataForChart[shift.workplace] = Number(shift.shiftRevenue);
      }
    });

    this.pieChartData.labels = Object.keys(dataForChart);
    this.pieChartData.datasets[0].data = Object.values(dataForChart);
    this.pieChart.updateChart();
  }
}
