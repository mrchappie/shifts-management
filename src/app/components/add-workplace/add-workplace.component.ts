import { Component } from '@angular/core';
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
  currentState!: State;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

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

  addWorkplace(workplace: string) {
    this.DB.updateFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [this.currentState.currentLoggedFireUser!.id],
      { userWorkplaces: arrayUnion(workplace) }
    );
    this.updateState();
  }

  removeWorkplace(workplace: string) {
    this.DB.updateFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [this.currentState.currentLoggedFireUser!.id],
      { userWorkplaces: arrayRemove(workplace) }
    );
    this.updateState();
  }

  async updateState() {
    const userSettings = await this.DB.getFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [this.currentState.currentLoggedFireUser!.id]
    );

    this.state.setState({
      currentLoggedFireUser: userSettings,
    });
  }
}
