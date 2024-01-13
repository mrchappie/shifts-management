import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from './utils/Interfaces';
import { StateService } from './utils/services/state/state.service';
import { Subscription } from 'rxjs';
import { AuthService } from './utils/services/auth/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgClass, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavbarComponent, NgIf, NgClass, RouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shift-management';
  currentState!: State;
  isLoggedIn: boolean = false;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private authService: AuthService) {}

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
