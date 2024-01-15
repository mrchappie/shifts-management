import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, State, UserSettings } from 'src/app/utils/Interfaces';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { CustomFilterPipe } from '../../../utils/pipes/customFilter/customFilter.pipe';
import { UserCardComponent } from './user-card/user-card.component';
import { NewSearchComponent } from '../../../components/new-search/new-search.component';
import { NgClass, NgFor } from '@angular/common';
import { ConfirmationModalComponent } from '../../../components/UI/confirmation-modal/confirmation-modal.component';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  standalone: true,
  imports: [
    ConfirmationModalComponent,
    NgClass,
    NewSearchComponent,
    NgFor,
    UserCardComponent,
    CustomFilterPipe,
  ],
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
    private toast: ToastService
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
      this.toast.success(successMessages.firestore.users.delete);
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }
}