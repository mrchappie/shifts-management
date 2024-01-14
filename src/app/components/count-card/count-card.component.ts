import { Component, Input } from '@angular/core';
import { CountI } from 'src/app/pages/admin/dashboard/dashboard.component';

@Component({
  standalone: true,
  selector: 'app-count-card',
  templateUrl: './count-card.component.html',
})
export class CountCardComponent {
  @Input() item!: CountI;
}
