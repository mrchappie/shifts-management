import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-count-card',
  templateUrl: './count-card.component.html',
})
export class CountCardComponent {
  @Input() item!: number;
  @Input() title!: string;
}
