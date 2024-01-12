import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, State, UserSettings } from 'src/app/utils/Interfaces';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
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
    queryLimit: 10,
  };

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  // component data
  allUsers: UserSettings[] = [];
  showModal: boolean = false;
  userID: string = '';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: FirestoreService,
    private router: Router,
    private _toastService: ToastService
  ) {}

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
      this.fbConfig.dev.usersDB,
      []
    );
  }

  toggleModal(event?: string) {
    this.userID = event as string;
    this.showModal = !this.showModal;
  }

  confirmModal(event: Event) {
    event.stopPropagation();
    try {
      this.DB.deleteFirestoreDoc(firebaseConfig.dev.usersDB, [this.userID]);
      this.showModal = !this.showModal;
      this._toastService.success('User deleted successfully!');
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (error) {
      this._toastService.error('Error deleting the user, please try again!');
    }
  }
}
