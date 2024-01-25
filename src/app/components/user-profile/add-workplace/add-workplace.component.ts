import { Component, Input } from '@angular/core';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { firestoreConfig } from 'firebase.config';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { State, UserSettings } from 'src/app/utils/Interfaces';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';

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
    } else {
      this.userWorkplaces =
        this.currentState.currentLoggedFireUser!.userWorkplaces;
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
        firestoreConfig.firestore.usersDB,
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
        firestoreConfig.firestore.usersDB,
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
    const userData = (await this.firestore.getFirestoreDoc(
      firestoreConfig.firestore.usersDB,
      [userID]
    )) as UserSettings;

    this.userWorkplaces = userData?.userWorkplaces;
  }

  // update state only if the user profile page is accessed
  async updateState() {
    const userSettings = await this.firestore.getFirestoreDoc(
      firestoreConfig.firestore.usersDB,
      [this.currentState.currentLoggedFireUser!.id]
    );

    this.state.setState({
      currentLoggedFireUser: userSettings,
    });
  }
}
