import { Component } from '@angular/core';
import { MyShiftsComponent } from '../../my-shifts/my-shifts.component';

@Component({
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  standalone: true,
  imports: [MyShiftsComponent],
})
export class AllShiftsComponent {
  constructor() {}
}
