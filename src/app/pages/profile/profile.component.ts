import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { SectionHeadingComponent } from 'src/app/components/UI/section-heading/section-heading.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { DividerComponent } from 'src/app/components/UI/divider/divider.component';
import { ChangeCredentialsComponent } from 'src/app/components/change-credentials/change-credentials.component';
import { AddWorkplaceComponent } from 'src/app/components/add-workplace/add-workplace.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    SectionHeadingComponent,
    UserProfileComponent,
    DividerComponent,
    ChangeCredentialsComponent,
    AddWorkplaceComponent,
  ],
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
