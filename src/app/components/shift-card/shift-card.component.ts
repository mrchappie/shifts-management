import { Component, Input } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';
import {
  NgIf,
  NgClass,
  SlicePipe,
  TitleCasePipe,
  CurrencyPipe,
} from '@angular/common';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, SlicePipe, TitleCasePipe, CurrencyPipe],
})
export class ShiftCardComponent {
  @Input() shift?: Shift;
  @Input() parentName!: string;
  @Input() sortQuery!: string;
}
