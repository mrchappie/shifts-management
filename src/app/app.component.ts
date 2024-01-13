import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from './utils/Interfaces';
import { StateService } from './utils/services/state/state.service';
import { Subscription } from 'rxjs';
import { AuthService } from './utils/services/auth/auth.service';
import { ToastService } from './utils/services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shift-management';
  currentState!: State;
  isLoggedIn: boolean = false;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private authService: AuthService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.getUserState();

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
