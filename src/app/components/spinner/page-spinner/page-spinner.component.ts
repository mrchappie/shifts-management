import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/utils/services/spinner/spinner.service';

@Component({
  standalone: true,
  selector: 'app-spinner',
  templateUrl: './page-spinner.component.html',
  styleUrls: ['./page-spinner.component.scss'],
  imports: [NgIf],
})
export class SpinnerComponent {
  toggleSpinner: boolean = false;

  constructor(private spinner: SpinnerService) {}

  ngOnInit(): void {
    this.spinner.spinnerState.subscribe((newSpinnerState) => {
      this.toggleSpinner = newSpinnerState;
    });
  }
}
