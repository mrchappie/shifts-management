import { Component, Input } from '@angular/core';
import { UserSettings } from 'src/app/utils/Interfaces';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() userInfo?: UserSettings;
}
