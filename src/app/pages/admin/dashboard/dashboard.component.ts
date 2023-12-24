import { Component } from '@angular/core';
import { PieData } from 'src/app/components/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  usersShiftsCountData: CountI[] = [
    { name: 'Total users', value: 10 },
    { name: 'Users this month', value: 10 },
    { name: 'Total shifts', value: 10 },
    { name: 'Shifts this month', value: 10 },
  ];
  pieChartLabels: string[] = ['Test 0', 'Test 1', 'Test 2', 'Test 3'];
  pieChartDatasets: PieData[] = [
    {
      data: [300, 500, 100, 30],
    },
  ];
}

export interface CountI {
  name: string;
  value: number;
}
