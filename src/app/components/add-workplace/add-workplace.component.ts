import { Component, Input } from '@angular/core';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { FirebaseConfigI, firestoreConfig } from 'firebase.config';
import { Subscription } from 'rxjs';
import { State } from '../../utils/Interfaces';
import { FirestoreService } from '../../utils/services/firestore/firestore.service';
import { StateService } from '../../utils/services/state/state.service';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';

@Component({
  selector: 'app-add-workplace',
  templateUrl: './add-workplace.component.html',
  standalone: true,
  imports: [FormsModule, MatIconModule, NgFor],
})
export class AddWorkplaceComponent {
  @Input() userIDFromURL!: string;
  currentState!: State;
  newWorkplace: string = '';
  userWorkplaces: string[] = [];

  // firestore Config
  fbConfig: FirebaseConfigI = firestoreConfig;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // init state
    this.currentState = this.state.getState();

    if (this.userIDFromURL) {
      // if exists, fetch edited user data
      this.getUserWorkplaces(this.userIDFromURL);
    }

    // state subscription to update currentState to the new global state
    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;

      if (!this.userIDFromURL) {
        this.userWorkplaces =
          this.currentState.currentLoggedFireUser!.userWorkplaces;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  // add workplace from firestore
  addWorkplace() {
    if (this.newWorkplace === '') return;
    try {
      this.firestore.updateFirestoreDoc(
        this.fbConfig.dev.usersDB,
        [this.userIDFromURL ?? this.currentState.currentLoggedFireUser!.id],
        { userWorkplaces: arrayUnion(this.newWorkplace) }
      );

      this.toast.success(successMessages.firestore.workplace.add);
      // updates the workplaces array variable
      if (
        !this.userWorkplaces.includes(this.newWorkplace) &&
        this.userIDFromURL
      ) {
        this.userWorkplaces.push(this.newWorkplace);
        this.newWorkplace = '';
      }
      // if regular user updates his profile, update the state
      if (!this.userIDFromURL) {
        this.updateState();
        this.newWorkplace = '';
        return;
      }
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  // remove workplace from firestore
  removeWorkplace(workplace: string) {
    try {
      this.firestore.updateFirestoreDoc(
        this.fbConfig.dev.usersDB,
        [this.userIDFromURL ?? this.currentState.currentLoggedFireUser!.id],
        { userWorkplaces: arrayRemove(workplace) }
      );
      this.toast.success(successMessages.firestore.workplace.delete);

      // updates the workplaces array variable
      if (
        !this.userWorkplaces.includes(this.newWorkplace) &&
        this.userIDFromURL
      ) {
        this.userWorkplaces.splice(this.userWorkplaces.indexOf(workplace), 1);
      }
      // if regular user updates his profile, update the state
      if (!this.userIDFromURL) {
        this.updateState();
        return;
      }
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  // fetch user workplaces if a user information is modified from admin panel
  async getUserWorkplaces(userID: string) {
    const userData = await this.firestore.getFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [userID]
    );

    this.userWorkplaces = userData?.userWorkplaces;
  }

  // update state only if the user profile page is accessed
  async updateState() {
    const userSettings = await this.firestore.getFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [this.currentState.currentLoggedFireUser!.id]
    );

    this.state.setState({
      currentLoggedFireUser: userSettings,
    });
  }
}
