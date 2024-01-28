import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettings } from 'src/app/utils/Interfaces';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { ButtonIconComponent } from 'src/app/components/UI/button/button-icon/button-icon.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, MatIconModule, RouterLink, ButtonIconComponent],
})
export class UserCardComponent {
  @Input() userInfo?: UserSettings;
  @Input() sortQuery!: string;
  @Output() openModalEvent = new EventEmitter<string>();

  openModal(userID: string) {
    this.openModalEvent.emit(userID);
  }
}
