import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [NgIf, MatIconModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentState!: State;
  activeComponent: string = '';
  currentUserName: string | undefined | null = '';
  public theme: string = 'light';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.activeComponent = this.currentState.activeComponent;
    this.currentUserName = this.currentState.currentLoggedFireUser?.firstName;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.activeComponent = this.currentState.activeComponent;
      this.currentUserName = this.currentState.currentLoggedFireUser?.firstName;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('class', this.theme);

    this.firestore.setLocalStorage('theme', this.theme);
  }
}
