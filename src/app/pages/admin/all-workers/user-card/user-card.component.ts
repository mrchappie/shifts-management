import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserSettings } from 'src/app/utils/Interfaces';

@Component({
  standalone: true,
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  imports: [NgIf, MatIconModule, RouterLink],
})
export class UserCardComponent {
  @Input() userInfo?: UserSettings;

  @Output() openModalEvent = new EventEmitter<string>();

  openModal(userID: string) {
    this.openModalEvent.emit(userID);
  }
}
