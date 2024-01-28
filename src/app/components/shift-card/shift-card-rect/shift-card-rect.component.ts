import {
  NgIf,
  NgClass,
  SlicePipe,
  TitleCasePipe,
  CurrencyPipe,
  DatePipe,
} from '@angular/common';
import { Component, Input } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import { MilisecondsToTimePipe } from 'src/app/utils/pipes/milisecondsToTime/miliseconds-to-time.pipe';

@Component({
  standalone: true,
  selector: 'app-shift-card-rect',
  templateUrl: './shift-card-rect.component.html',
  styleUrls: ['./shift-card-rect.component.scss'],
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
export class ShiftCardRectComponent {
  @Input() shift?: Shift;
  @Input() parentName!: string;
  @Input() sortQuery!: string;
}
