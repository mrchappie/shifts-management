import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.component.html',
  standalone: true,
})
export class SectionHeadingComponent {
  @Input() heading: string = '';
  @Input() secHeading: string = '';
}
