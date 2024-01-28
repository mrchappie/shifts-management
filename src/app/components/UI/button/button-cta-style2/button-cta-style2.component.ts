import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button-cta-style2',
  templateUrl: './button-cta-style2.component.html',
  styleUrls: ['./button-cta-style2.component.scss'],
})
export class ButtonCtaStyle2Component {
  @Input() parent: string = '';
}
