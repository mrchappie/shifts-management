import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputType, formData } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Shift, State, UserSettings } from 'src/app/utils/Interfaces';
import { firestoreConfig } from 'firebase.config';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeadingComponent } from '../../components/UI/section-heading/section-heading.component';
import { NgIf, NgFor, LowerCasePipe, DatePipe } from '@angular/common';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { ValidationService } from './validationService/validation.service';
import { timeStringToMilliseconds } from 'src/app/utils/functions';
import { MilisecondsToTimePipe } from 'src/app/utils/pipes/milisecondsToTime/miliseconds-to-time.pipe';
import { StatisticsService } from 'src/app/utils/services/statistics/statistics.service';

@Component({
  selector: 'app-handle-shifts',
  templateUrl: './handle-shifts.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    SectionHeadingComponent,
    NgFor,
    MatIconModule,
    LowerCasePipe,
    DatePipe,
    MilisecondsToTimePipe,
  ],
})
export class HandleShiftsComponent implements OnInit {
  // parent component
  parent: string = 'add-shift';

  currentState!: State;
  currentUser!: UserSettings;
  shiftForm!: FormGroup;
  shiftInputs: InputType[] = formData;
  userWorkplaces: string[] = [];
  isEditing: boolean = false;
  shiftToEdit!: Shift;

  userIDParams!: string;
  shiftIDParams!: string;

  private stateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private state: StateService,
    private firestore: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private validation: ValidationService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    // extracting params from url
    this.route.queryParams.subscribe((params) => {
      if (params.userID) {
        this.userIDParams = params.userID;
        console.log(this.userIDParams);
      }
      if (params.shiftID) {
        this.shiftIDParams = params.shiftID;
        console.log(this.shiftIDParams);
      }
    });

    this.shiftForm = this.fb.group({
      shiftID: [uuidv4()],
      shiftDate: ['', [Validators.required]],
      startTime: ['12:00', [Validators.required]],
      endTime: ['20:00', [Validators.required]],
      workplace: ['Penny', [Validators.required]],
      wagePerHour: ['10', [Validators.required]],
      shiftRevenue: ['80'],
    });

    this.currentState = this.state.getState();
    this.currentUser = this.currentState.currentLoggedFireUser as UserSettings;

    // check if component is loaded from regular user pages
    if (!this.router.url.split('/').includes('admin')) {
      if (this.shiftIDParams) {
        this.userWorkplaces =
          this.currentState.currentLoggedFireUser?.userWorkplaces ?? [];
        this.isEditing = true;
        this.parent = 'my-shifts';
      } else {
        this.userWorkplaces =
          this.currentState.currentLoggedFireUser?.userWorkplaces ?? [];
        this.isEditing = false;
        this.parent = 'add-shift';
      }
    }
    // check if component is loaded from admin pages
    if (this.router.url.split('/').includes('admin')) {
      if (this.router.url.split('/').includes('all-shifts')) {
        this.getEditedUserData(this.userIDParams);
        this.isEditing = true;
        this.parent = 'all-shifts';
      }
      if (this.router.url.split('/').includes('all-users')) {
        this.getEditedUserData(this.userIDParams);
        this.isEditing = true;
        this.parent = 'edit-user';
      }
    }

    if (this.parent != 'add-shift') {
      this.loadShiftData();
    } else {
      this.shiftForm.patchValue({ shiftDate: this.getTodayDate() });
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.currentUser = this.currentState
        .currentLoggedFireUser as UserSettings;
    });

    // observables for each form input that we need to calculate revenue
    this.shiftForm
      .get('wagePerHour')
      ?.valueChanges.subscribe((value: number) => {
        this.calculateRevenue(
          value,
          this.shiftForm.value.startTime,
          this.shiftForm.value.endTime
        );
      });
    this.shiftForm.get('startTime')?.valueChanges.subscribe((value: string) => {
      this.calculateRevenue(
        this.shiftForm.value.wagePerHour,
        value,
        this.shiftForm.value.endTime
      );
    });
    this.shiftForm.get('endTime')?.valueChanges.subscribe((value: string) => {
      this.calculateRevenue(
        this.shiftForm.value.wagePerHour,
        this.shiftForm.value.startTime,
        value
      );
    });
  }

  // Helper method to convert milliseconds to Date and format as date string
  formatDate(milliseconds: number): string {
    const date = new Date(milliseconds);
    // 'yyyy-MM-dd'

    return `${date.getFullYear().toString().padStart(2, '0')}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
  // Helper method to convert milliseconds to Date and format as time string
  formatTime(milliseconds: number): string {
    const time = new Date(milliseconds);
    // 'HH:mm'
    return `${(time.getHours() - 2).toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async loadShiftData() {
    const shiftToBeEdited = await this.firestore.getFirestoreDoc(
      firestoreConfig.dev.shiftsDB.base,
      [
        firestoreConfig.dev.shiftsDB.shiftsSubColl,
        this.userIDParams ? this.userIDParams : this.currentUser.id,
        this.shiftIDParams,
      ]
    );

    console.log(shiftToBeEdited);
    this.shiftToEdit = shiftToBeEdited as Shift;

    // if a shift is edited, patch the form with the shift values
    if (this.shiftToEdit) {
      console.log(this.parent);
      this.shiftForm.patchValue({
        ...this.shiftToEdit,
        shiftDate: this.formatDate(this.shiftToEdit.shiftDate),
        startTime: this.formatTime(this.shiftToEdit.startTime),
        endTime: this.formatTime(this.shiftToEdit.endTime),
      });
    }
  }

  async getEditedUserData(userID: string) {
    const data = (await this.firestore.getFirestoreDoc(
      firestoreConfig.dev.usersDB,
      [userID]
    )) as UserSettings;

    if (data) {
      this.userWorkplaces = data.userWorkplaces;
    }
  }

  calculateRevenue(wage: number, startTime: string, endTime: string) {
    const MINUTES_PER_HOUR: number = 60;
    const HOURS_IN_DAY: number = 24;
    const startHours: string = startTime.split(':')[0];
    const startMinutes: string = startTime.split(':')[1];
    const endHours: string = endTime.split(':')[0];
    const endMinutes: string = endTime.split(':')[1];

    const startTimeMinutes: number =
      +startHours * MINUTES_PER_HOUR + +startMinutes;
    const endTimeMinutes: number = +endHours * MINUTES_PER_HOUR + +endMinutes;

    // check to see if none of the time inputs are empty
    if (isNaN(startTimeMinutes) || isNaN(endTimeMinutes)) return;

    // check to see if start time is in the same day as end time
    if (startTimeMinutes > endTimeMinutes) {
      this.shiftForm.patchValue({
        shiftRevenue: Math.round(
          ((endTimeMinutes +
            HOURS_IN_DAY * MINUTES_PER_HOUR -
            startTimeMinutes) /
            60) *
            wage
        ).toString(),
      });
    } else {
      this.shiftForm.patchValue({
        shiftRevenue: Math.round(
          ((endTimeMinutes - startTimeMinutes) / 60) * wage
        ).toString(),
      });
    }
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // form validation service
  formInputStatus(control: string): boolean {
    return this.validation.getFormInputStatus(this.shiftForm, control);
  }
  getErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.shiftForm, control);
  }

  async onSubmit() {
    try {
      const shiftID = this.shiftForm.value.shiftID;

      const shiftData: Shift = {
        shiftID: this.shiftForm.value.shiftID,
        shiftDate: new Date(this.shiftForm.value.shiftDate).getTime(),
        startTime: timeStringToMilliseconds(this.shiftForm.value.startTime),
        endTime: timeStringToMilliseconds(this.shiftForm.value.endTime),
        workplace: this.shiftForm.value.workplace,
        wagePerHour: Number(this.shiftForm.value.wagePerHour),
        shiftRevenue: Number(this.shiftForm.value.shiftRevenue),
        creationDate: this.shiftToEdit
          ? this.shiftToEdit.creationDate
          : new Date(),
        lastUpdateDate: new Date(),
        userID:
          this.parent === 'my-shifts' || this.parent === 'add-shift'
            ? this.currentUser.id
            : this.userIDParams,
        userInfo: {
          firstName:
            this.parent === 'my-shifts' || this.parent === 'add-shift'
              ? this.currentUser.firstName
              : this.shiftToEdit.userInfo.firstName,
          lastName:
            this.parent === 'my-shifts' || this.parent === 'add-shift'
              ? this.currentUser.lastName
              : this.shiftToEdit.userInfo.lastName,
        },
      };

      // setting the shift in DB
      await this.firestore
        .setFirestoreDoc(
          firestoreConfig.dev.shiftsDB.base,
          [
            firestoreConfig.dev.shiftsDB.shiftsSubColl,
            this.parent === 'my-shifts' || this.parent === 'add-shift'
              ? this.currentUser.id
              : this.userIDParams,
            shiftID,
          ],
          shiftData
        )
        .then(() => {
          // after the setFirestoreDoc function call is done, a toast is generated
          if (!this.isEditing) {
            this.toast.success(successMessages.firestore.shift.add);
          } else {
            this.toast.success(successMessages.firestore.shift.update);
            this.state.setState({ shiftToEdit: undefined });
          }
        });

      if (!this.isEditing) {
        // update statistics in DB if a new shift is added
        this.statsService.updateUserStatistics(
          ['shiftCountByMonth', 'january'],
          1,
          'add',
          'shift'
        );
        this.statsService.updateUserStatistics(
          ['earnedRevenueByMonth', 'january'],
          shiftData.shiftRevenue,
          'add',
          'revenue'
        );
      } else {
        const newRevenue = shiftData.shiftRevenue;
        const oldRevenue = this.shiftToEdit.shiftRevenue;
        const diff = newRevenue - oldRevenue;
        console.log(newRevenue, oldRevenue, diff);

        if (diff) {
          this.statsService.updateUserStatistics(
            ['shiftCountByMonth', 'january'],
            0,
            'add',
            'shift'
          );
          this.statsService.updateUserStatistics(
            ['earnedRevenueByMonth', 'january'],
            diff,
            'add',
            'revenue'
          );
        }
      }

      const getRouteToNavigate = () => {
        if (this.parent === 'my-shifts') {
          return ['my-shifts'];
        }
        // redirect to all-shifts page after an admin edits a shift from all-shifts page
        if (this.parent === 'all-shifts') {
          return ['admin/all-shifts'];
        }
        // redirect to edit-user page for that particular user after an admin edits a user shift
        if (this.parent === 'edit-user') {
          return ['admin/all-users/edit-user', this.userIDParams];
        }
        // default route when an user adds a shifts
        return ['my-shifts'];
      };

      this.router
        .navigate([getRouteToNavigate()[0]], {
          queryParams: { userID: getRouteToNavigate()[1] },
        })
        .then(() => {
          this.shiftForm.patchValue(this.initialFormValue);
        });
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  private initialFormValue = {
    shiftID: [uuidv4()],
    shiftDate: '',
    startTime: this.getTodayDate(),
    endTime: '',
    workplace: '',
    wagePerHour: '',
    shiftRevenue: '',
  };
}
