import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentState!: State;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: FirestoreService) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
