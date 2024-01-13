import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-section-heading',
  templateUrl: './section-heading.component.html',
})
export class SectionHeadingComponent {
  @Input() heading: string = '';
  @Input() secHeading: string = '';
}
