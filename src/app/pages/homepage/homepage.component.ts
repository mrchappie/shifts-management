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
    // { label: 'Shifts last week', value: 0 },
    // { label: 'Shifts this week', value: 0 },
    // { label: 'Shifts next week', value: 0 },
  ];

  chartBorder: any = { borderColor: 'black', borderWidth: 0.5 };

  //! PIE CHART
  @ViewChild('pieChart') pieChart!: ChartComponent;
  public pieChartData: ChartData<ChartType, number[], string | string[]> = {
    labels: [],
    datasets: [{ ...this.chartBorder, data: [], label: 'Revenue' }],
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
        text: 'Revenue per month',
      },
    },
  };

  //! LINE CHART
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
        text: 'Worked hours by workplace - Top 5 this month',
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
    // this.shiftsCountData[0].value = data.totalShifts;
    // this.shiftsCountData[2].value = data.lastWeek;
    // this.shiftsCountData[3].value = data.thisWeek;
    // this.shiftsCountData[4].value = data.nextWeek;

    // Charts
    (async () => {
      this.userShifts = await this.DB.handleGetShiftsByUserID(
        this.loggedUserID
      );

      this.handlePieChartData();
      this.handlePolarAreaChartData();
    })();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.loggedUserID = this.currentState.currentLoggedFireUser!.id;
    });

    this.handleBarChartData();
    this.handleLineChartData();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  //? HANDLE PIE CHART DATA
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

    const sortedData = Object.entries(dataForChart)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.pieChartData.labels = sortedData.map((item) => item[0]);
    this.pieChartData.datasets[0].data = sortedData.map((item) => item[1]);
    this.pieChart.updateChart();
  }

  //? HANDLE BAR CHART DATA
  handleBarChartData() {
    const arr: number[] = [];
    //prettier-ignore
    const months = [
      "january","february","march","april","may","june","july",
      "august", "september", "october", "november", "december"
    ];

    const fetchData = async (month: string) => {
      try {
        const queryOptions = {
          month: '',
          year: '',
          collectionName: firebaseConfig.dev.shiftsDB,
          collectionPath: [new Date().getFullYear().toString(), month],
          queryName: 'userID',
          queryValue: this.loggedUserID,
          itemToQuery: 'shiftRevenue',
        };

        const data = await this.DB.getFirebaseSum(queryOptions);
        if (data) {
          arr.push(Math.trunc(data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.barChartData.labels = months.map(
          (month) => month.charAt(0).toUpperCase() + month.slice(1)
        );
        this.barChartData.datasets[0].data = arr;
        this.barChart.updateChart();
      }
    };

    months.forEach((month) => fetchData(month));
  }

  //? HANDLE LINE CHART DATA
  handleLineChartData() {
    const arr: number[] = [];
    //prettier-ignore
    const months = [
      "january","february","march","april","may","june","july",
      "august", "september", "october", "november", "december"
    ];

    const fetchData = async (month: string) => {
      try {
        const queryOptions = {
          month: '',
          year: '',
          collectionName: 'shiftAppShifts',
          collectionPath: [new Date().getFullYear().toString(), month],
          queryName: 'userID',
          queryValue: this.loggedUserID,
          itemToQuery: '',
        };

        const data = await this.DB.getFirebaseCount(queryOptions);
        if (data) {
          arr.push(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.lineChartData.labels = months.map(
          (month) => month.charAt(0).toUpperCase() + month.slice(1)
        );
        this.lineChartData.datasets[0].data = arr;

        this.shiftsCountData[0].value = arr.reduce((a, b) => a + b, 0);
        this.shiftsCountData[1].value = arr[arr.length - 1];

        this.lineChart.updateChart();
      }
    };

    months.forEach((month) => fetchData(month));
  }

  //? HANDLE POLAR AREA CHART DATA
  handlePolarAreaChartData() {
    const shiftsToFilter = structuredClone(this.userShifts);
    const reducedShifts: { [key: string]: number | string }[] = [];
    const dataForChart: { [key: string]: number } = {};

    // extracting wage, revenue and workplace from each shift
    shiftsToFilter.map((shift: Shift) => {
      reducedShifts.push({
        wage: shift.wagePerHour,
        revenue: shift.shiftRevenue,
        workplace: shift.workplace,
      });
    });

    // calculationg worked hours per workplace
    reducedShifts.map((shift) => {
      const hours: number = Math.trunc(
        Number(shift.revenue) / Number(shift.wage)
      );
      if (dataForChart[shift.workplace]) {
        dataForChart[shift.workplace] += hours;
      } else {
        dataForChart[shift.workplace] = hours;
      }
    });

    const sortedData = Object.entries(dataForChart)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.polarAreaChartData.labels = sortedData.map((item) => item[0]);
    this.polarAreaChartData.datasets[0].data = sortedData.map(
      (item) => item[1]
    );

    this.polarArea.updateChart();
  }
}
