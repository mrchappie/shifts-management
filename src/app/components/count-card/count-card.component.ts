import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-count-card',
  templateUrl: './count-card.component.html',
  imports: [NgIf, CurrencyPipe],
})
export class CountCardComponent {
  @Input() value!: number;
  @Input() title!: string;
  @Input() subtitle!: string | undefined;
}
