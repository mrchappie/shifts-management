import { Component } from '@angular/core';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { Subscription } from 'rxjs';
import { PieData } from 'src/app/components/chart/chart.component';
import { Shift, State } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { CountI } from '../admin/dashboard/dashboard.component';

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

  pieChartLabels: string[] = ['Test 0', 'Test 1', 'Test 2', 'Test 3'];
  pieChartDatasets: PieData[] = [
    {
      data: [300, 500, 100, 30],
    },
  ];

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
    const data = this.currentState.currentLoggedFireUser!.shiftsCount;

    this.shiftsCountData[0].value = data.totalShifts;
    this.shiftsCountData[2].value = data.lastWeek;
    this.shiftsCountData[3].value = data.thisWeek;
    this.shiftsCountData[4].value = data.nextWeek;

    //
    (async () => {
      this.userShifts = await this.DB.getFirestoreDocsByQuery(
        this.fbConfig.dev.shiftsDB,
        ['2023', 'december'],
        this.loggedUserID
      );

      this.handleShiftsData();
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

  handleShiftsData() {
    const shiftsToFilter = JSON.parse(JSON.stringify(this.userShifts));

    const dataForChart: { [key: string]: number } = {};

    shiftsToFilter.map((shift: Shift) => {
      if (dataForChart[shift.workplace]) {
        dataForChart[shift.workplace] += Number(shift.shiftRevenue);
      } else {
        dataForChart[shift.workplace] = Number(shift.shiftRevenue);
      }
    });

    this.pieChartLabels = Object.keys(dataForChart);
    this.pieChartDatasets = [{ data: Object.values(dataForChart) }];
  }
}
