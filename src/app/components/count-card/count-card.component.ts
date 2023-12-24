import { Component, Input } from '@angular/core';
import { CountI } from 'src/app/pages/admin/dashboard/dashboard.component';

@Component({
  selector: 'app-count-card',
  templateUrl: './count-card.component.html',
  styleUrls: ['./count-card.component.scss'],
})
export class CountCardComponent {
  @Input() item!: CountI;
}
