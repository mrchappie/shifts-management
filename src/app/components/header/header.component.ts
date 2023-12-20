import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentState!: State;
  activeComponent: string = '';
  currentUserName: string | undefined | null = '';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: HandleDBService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.activeComponent = this.currentState.activeComponent;

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
}
