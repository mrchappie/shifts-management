import { Component, Input } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
})
export class ShiftCardComponent {
  @Input() shift?: Shift;
  @Input() parentName!: string;
}
