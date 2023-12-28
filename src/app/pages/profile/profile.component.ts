import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SettingsForm,
  settingsFormData,
} from '../../components/user-profile/formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { Subscription } from 'rxjs';
import { State, UserSettings } from 'src/app/utils/Interfaces';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentState!: State;
  settingsFormInputs: SettingsForm[] = settingsFormData;
  userSettings!: UserSettings;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

  ngOnInit(): void {
    this.currentState = this.state.getState();
    this.updateState();

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async updateState() {
    this.userSettings = (await this.DB.getFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [this.currentState.currentLoggedFireUser!.id]
    )) as UserSettings;

    this.state.setState({
      currentLoggedFireUser: this.userSettings,
    });
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
}
