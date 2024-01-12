import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettings } from 'src/app/utils/Interfaces';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  @Input() userInfo?: UserSettings;

  @Output() openModalEvent = new EventEmitter<string>();

  openModal(userID: string) {
    this.openModalEvent.emit(userID);
  }
}
