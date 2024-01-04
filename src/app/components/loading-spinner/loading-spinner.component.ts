import { Component } from '@angular/core';
import { LoaderService } from 'src/app/utils/services/loadingSpinner/loader.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  isLoading$ = this.loaderService.getLoading();

  constructor(private loaderService: LoaderService) {}
}
