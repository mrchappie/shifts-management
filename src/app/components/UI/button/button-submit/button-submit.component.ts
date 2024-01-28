import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-submit',
  templateUrl: './button-submit.component.html',
  styleUrls: ['./button-submit.component.scss'],
  standalone: true,
})
export class ButtonSubmitComponent {
  @Input() parent: string = '';
  @Input() disabled: boolean = false;
  @Input() type: string = '';
}
