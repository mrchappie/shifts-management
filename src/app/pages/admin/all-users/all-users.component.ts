import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchFilters, State, UserSettings } from 'src/app/utils/Interfaces';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { firestoreConfig } from 'firebase.config';
import { CustomShiftsFilterPipe } from '../../../utils/pipes/customFilter/custom-shifts-filter.pipe';
import { UserCardComponent } from './user-card/user-card.component';
import { NewSearchComponent } from '../../../components/search/search.component';
import { NgClass, NgFor } from '@angular/common';
import { ConfirmationModalComponent } from '../../../components/UI/confirmation-modal/confirmation-modal.component';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { CustomUsersSortPipe } from 'src/app/utils/pipes/customSort/custom-users-sort.pipe';

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
    CustomShiftsFilterPipe,
    CustomUsersSortPipe,
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

  // component data
  allUsers: UserSettings[] = [];
  showModal: boolean = false;
  editedUserInfo!: UserSettings;

  title: string = 'Delete user?';
  message: string = 'Are you sure you want to delete this user?';

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
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
    this.allUsers = await this.firestore.getFirestoreDocs(
      firestoreConfig.firestore.usersDB,
      []
    );
  }

  toggleModal(event?: any) {
    this.editedUserInfo = event?.user;
    this.title = event?.title;
    this.message = event?.message;
    this.showModal = !this.showModal;
  }

  confirmModal(event: Event) {
    event.stopPropagation();
    try {
      this.firestore.updateFirestoreDoc(
        firestoreConfig.firestore.usersDB,
        [this.editedUserInfo.id],
        {
          role: `${
            this.editedUserInfo.role === 'disabled' ? 'user' : 'disabled'
          }`,
        }
      );
      this.showModal = !this.showModal;
      this.toast.success(
        this.editedUserInfo.role === 'disabled'
          ? successMessages.firestore.users.enabled
          : successMessages.firestore.users.disabled
      );
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }
}
