import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, State, UserSettings } from 'src/app/utils/Interfaces';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/utils/services/state/state.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit, OnDestroy {
  // state
  currentState!: State;
  filters: SearchFilters = {
    nameQuery: '',
    startDateQuery: '',
    endDateQuery: '',
    sortByQuery: '',
    orderByQuery: '',
    yearMonthQuery: '',
  };

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  // component data
  allUsers: UserSettings[] = [];

  private stateSubscription: Subscription | undefined;

  constructor(private state: StateService, private DB: HandleDBService) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.currentState = this.state.getState();
    this.filters = this.currentState.searchForm;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.filters = this.currentState.searchForm;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getAllUsers() {
    this.allUsers = await this.DB.getFirestoreDocs(
      this.fbConfig.deploy.usersDB,
      []
    );
  }
}
