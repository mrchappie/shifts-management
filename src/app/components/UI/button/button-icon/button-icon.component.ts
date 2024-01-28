import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
  imports: [MatIconModule, NgClass],
})
export class ButtonIconComponent {
  @Input() parent: string = '';
  @Input() type: string = '';
  @Input() disabled: boolean = false;
  @Input() icon: string = 'edit';
  @Input() style: string[] = [];
}
