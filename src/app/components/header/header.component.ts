import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentState!: State;
  activeComponent: string = '';
  currentUserName: string | undefined | null = '';
  public theme: string = 'light';

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

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

    this.DB.setLocalStorage('theme', this.theme);
  }
}
