import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettings } from 'src/app/utils/Interfaces';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  standalone: true,
  imports: [NgIf, MatIconModule, RouterLink],
})
export class UserCardComponent {
  @Input() userInfo?: UserSettings;

  @Output() openModalEvent = new EventEmitter<string>();

  openModal(userID: string) {
    this.openModalEvent.emit(userID);
  }
}
