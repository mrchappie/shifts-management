import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { InlineSpinnerService } from 'src/app/utils/services/spinner/inline-spinner.service';

@Component({
  standalone: true,
  selector: 'app-inline-spinner',
  templateUrl: './inline-spinner.component.html',
  styleUrls: ['./inline-spinner.component.scss'],
  imports: [NgIf],
})
export class InlineSpinnerComponent {
  toggleSpinner: boolean = false;

  constructor(private spinner: InlineSpinnerService) {}

  ngOnInit(): void {
    this.spinner.spinnerState.subscribe((newSpinnerState) => {
      this.toggleSpinner = newSpinnerState;
    });
  }
}
