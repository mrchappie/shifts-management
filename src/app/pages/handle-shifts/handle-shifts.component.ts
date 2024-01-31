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
import { UpdateStatsService } from './updateStatsService/update-stats.service';
import { getRouteToNavigate, getTodayDate } from './helpers';
import { WeekShiftsComponent } from './week-shifts/week-shifts.component';
import { ButtonSubmitComponent } from 'src/app/components/UI/button/button-submit/button-submit.component';
import { defaultStatsObject } from 'src/app/utils/services/statistics/defaultStatsObject';

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
    WeekShiftsComponent,
    ButtonSubmitComponent,
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
    private updateStats: UpdateStatsService
  ) {}

  ngOnInit(): void {
    // extracting params from url
    this.route.queryParams.subscribe((params) => {
      if (params.userID) {
        this.userIDParams = params.userID;
        // console.log(this.userIDParams);
      }
      if (params.shiftID) {
        this.shiftIDParams = params.shiftID;
        // console.log(this.shiftIDParams);
      }
    });

    this.shiftForm = this.fb.group({
      shiftID: [uuidv4()],
      shiftDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      workplace: ['', [Validators.required]],
      wagePerHour: ['', [Validators.required]],
      shiftRevenue: [''],
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
      this.shiftForm.patchValue({ shiftDate: getTodayDate() });
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

    // this.firestore.setFirestoreDoc(
    //   firestoreConfig.firestore.statistics.base,
    //   [
    //     firestoreConfig.firestore.statistics.users,
    //     '2024',
    //     'po95g2uIWdVoruXf2AQGeKhVTnG3',
    //   ],
    //   defaultStatsObject
    // );

    // this.firestore.setFirestoreDoc(
    //   firestoreConfig.firestore.statistics.base,
    //   [firestoreConfig.firestore.statistics.admin, 'year', '2021'],
    //   defaultStatsObject
    // );

    // for (let i = 0; i < 10; i++) {
    //   setTimeout(() => {
    //     this.generateRandomShifts();
    //   }, 3000);
    // }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
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

  async loadShiftData() {
    const shiftToBeEdited = await this.firestore.getFirestoreDoc(
      firestoreConfig.firestore.shiftsDB.base,
      [
        firestoreConfig.firestore.shiftsDB.shifts,
        this.userIDParams ? this.userIDParams : this.currentUser.id,
        this.shiftIDParams,
      ]
    );

    // console.log(shiftToBeEdited);
    this.shiftToEdit = shiftToBeEdited as Shift;

    // if a shift is edited, patch the form with the shift values
    if (this.shiftToEdit) {
      // console.log(this.parent);
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
      firestoreConfig.firestore.usersDB,
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
          firestoreConfig.firestore.shiftsDB.base,
          [
            firestoreConfig.firestore.shiftsDB.shifts,
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

      // update statistics
      if (!this.isEditing) {
        this.updateStats.addNewShiftStats(
          this.currentState.currentLoggedFireUser!.id,
          shiftData
        );
      } else {
        this.updateStats.updateExistingShiftStats(
          this.currentState.currentLoggedFireUser!.id,
          shiftData,
          this.shiftToEdit
        );
      }

      this.router
        .navigate([getRouteToNavigate(this.parent)[0]], {
          queryParams: {
            userID: getRouteToNavigate(this.parent, this.userIDParams)[1],
          },
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
    startTime: getTodayDate(),
    endTime: '',
    workplace: '',
    wagePerHour: '',
    shiftRevenue: '',
  };

  // generateRandomShifts() {
  //   function getRandomArbitrary(min: number, max: number) {
  //     return Math.floor(Math.random() * (max - min) + min);
  //   }

  //   this.shiftForm.patchValue({
  //     shiftID: uuidv4(),
  //     shiftDate: `2023-${getRandomArbitrary(1, 13)
  //       .toString()
  //       .padStart(2, '0')}-${getRandomArbitrary(1, 32)
  //       .toString()
  //       .padStart(2, '0')}`,
  //     startTime: `${getRandomArbitrary(0, 24)
  //       .toString()
  //       .padStart(2, '0')}:${getRandomArbitrary(0, 61)
  //       .toString()
  //       .padStart(2, '0')}`,
  //     endTime: `${getRandomArbitrary(0, 24)
  //       .toString()
  //       .padStart(2, '0')}:${getRandomArbitrary(0, 61)
  //       .toString()
  //       .padStart(2, '0')}`,
  //     workplace: `${this.currentState.currentLoggedFireUser?.userWorkplaces[
  //       getRandomArbitrary(
  //         0,
  //         this.currentState.currentLoggedFireUser?.userWorkplaces.length
  //       )
  //     ].toLowerCase()}`,
  //     wagePerHour: `${getRandomArbitrary(10, 30)}`,
  //     shiftRevenue: ``,
  //   });

  //   console.log(this.shiftForm.value);
  //   this.calculateRevenue(
  //     this.shiftForm.get('wagePerHour')?.value,
  //     this.shiftForm.get('startTime')?.value,
  //     this.shiftForm.get('endTime')?.value
  //   );

  //   this.onSubmit();
  // }
}
