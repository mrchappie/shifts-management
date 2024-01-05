import { Component, Input } from '@angular/core';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { Subscription } from 'rxjs';
import { State } from '../../utils/Interfaces';
import { HandleDBService } from '../../utils/services/handleDB/handle-db.service';
import { StateService } from '../../utils/services/state/state.service';

@Component({
  selector: 'app-add-workplace',
  templateUrl: './add-workplace.component.html',
  styleUrls: ['./add-workplace.component.scss'],
})
export class AddWorkplaceComponent {
  @Input() userIDFromURL!: string;
  currentState!: State;
  newWorkplace: string = '';
  userWorkplaces: string[] = [];

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

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

  // add workplace from DB
  addWorkplace() {
    if (this.newWorkplace === '') return;
    this.DB.updateFirestoreDoc(
      this.fbConfig.deploy.usersDB,
      [this.userIDFromURL ?? this.currentState.currentLoggedFireUser!.id],
      { userWorkplaces: arrayUnion(this.newWorkplace) }
    );
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
  }

  // remove workplace from db
  removeWorkplace(workplace: string) {
    this.DB.updateFirestoreDoc(
      this.fbConfig.deploy.usersDB,
      [this.userIDFromURL ?? this.currentState.currentLoggedFireUser!.id],
      { userWorkplaces: arrayRemove(workplace) }
    );
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
  }

  // fetch user workplaces if a user information is modified from admin panel
  async getUserWorkplaces(userID: string) {
    const userData = await this.DB.getFirestoreDoc(
      this.fbConfig.deploy.usersDB,
      [userID]
    );

    this.userWorkplaces = userData?.userWorkplaces;
  }

  // update state only if the user profile page is accessed
  async updateState() {
    const userSettings = await this.DB.getFirestoreDoc(
      this.fbConfig.deploy.usersDB,
      [this.currentState.currentLoggedFireUser!.id]
    );

    this.state.setState({
      currentLoggedFireUser: userSettings,
    });
  }
}
