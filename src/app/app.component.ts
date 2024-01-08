import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from './utils/Interfaces';
import { StateService } from './utils/services/state/state.service';
import { HandleDBService } from './utils/services/handleDB/handle-db.service';
import { Subscription } from 'rxjs';
import { LoaderService } from './utils/services/loadingSpinner/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shift-management';
  currentState!: State;
  isLoggedIn: boolean = false;
  isLoading$ = this.loaderService.loading;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: HandleDBService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.DB.getUserState();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.isLoggedIn = this.currentState.isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
