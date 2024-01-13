import { Component } from '@angular/core';
import { MyShiftsComponent } from '../../my-shifts/my-shifts.component';

@Component({
  standalone: true,
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  imports: [MyShiftsComponent],
})
export class AllShiftsComponent {
  constructor() {}
}
