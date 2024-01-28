import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button-cta',
  templateUrl: './button-cta.component.html',
  styleUrls: ['./button-cta.component.scss'],
})
export class ButtonCtaComponent {
  @Input() parent: string = '';
}
