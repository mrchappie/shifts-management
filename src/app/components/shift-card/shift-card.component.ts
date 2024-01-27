import { Component, Input } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import {
  NgIf,
  NgClass,
  SlicePipe,
  TitleCasePipe,
  CurrencyPipe,
  DatePipe,
} from '@angular/common';
import { MilisecondsToTimePipe } from 'src/app/utils/pipes/milisecondsToTime/miliseconds-to-time.pipe';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    SlicePipe,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe,
    MilisecondsToTimePipe,
  ],
})
export class ShiftCardComponent {
  @Input() shift?: Shift;
  @Input() sortQuery!: string;
  @Input() parentName!: string;
}
