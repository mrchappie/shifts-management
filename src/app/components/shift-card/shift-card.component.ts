import {
  CurrencyPipe,
  NgClass,
  NgIf,
  SlicePipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, Input } from '@angular/core';
import { Shift } from 'src/app/utils/Interfaces';

@Component({
  standalone: true,
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
  imports: [NgIf, SlicePipe, NgClass, TitleCasePipe, CurrencyPipe],
})
export class ShiftCardComponent {
  @Input() shift?: Shift;
  @Input() parentName!: string;
  @Input() sortQuery!: string;
}
