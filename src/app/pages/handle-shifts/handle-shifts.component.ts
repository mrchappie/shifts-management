import { Component, Input, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { Shift, State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firestoreConfig } from 'firebase.config';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeadingComponent } from '../../components/UI/section-heading/section-heading.component';
import { NgIf, NgFor, LowerCasePipe } from '@angular/common';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { ValidationService } from './validationService/validation.service';

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
  ],
})
export class HandleShiftsComponent implements OnInit {
  // parent component
  @Input() parent: string = 'my-shifts';

  currentState!: State;

  shiftForm!: FormGroup;
  shiftInputs: InputType[] = formData;
  userWorkplaces: string[] = [];
  isEditing: boolean = false;

  // firestore Config
  fbConfig: FirebaseConfigI = firestoreConfig;

  private stateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private state: StateService,
    private firestore: FirestoreService,
    private router: Router,
    private toast: ToastService,
    private validation: ValidationService
  ) {}

  ngOnInit(): void {
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

    // check if url contains 'admin' || 'edit-shift' || 'all-shifts' keyword and sets isEditing state and userWorkplaces
    if (
      this.router.url.split('/').includes('admin') &&
      this.router.url.split('/').includes('edit-shift')
    ) {
      this.userWorkplaces =
        this.currentState.editedUserData?.userWorkplaces ?? [];
      this.isEditing = true;
    } else if (this.router.url.split('/').includes('edit-shift')) {
      this.userWorkplaces =
        this.currentState.currentLoggedFireUser?.userWorkplaces ?? [];
      this.isEditing = true;
    } else if (this.router.url.split('/').includes('all-shifts')) {
      this.userWorkplaces =
        this.currentState.editedUserData?.userWorkplaces ?? [];
      this.isEditing = true;
    } else {
      this.userWorkplaces =
        this.currentState.currentLoggedFireUser?.userWorkplaces ?? [];
      this.isEditing = false;
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
    });

    if (this.currentState.shiftToEdit) {
      this.shiftForm.patchValue(this.currentState.shiftToEdit);
    } else {
      this.shiftForm.patchValue({ shiftDate: this.getTodayDate() });
    }

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

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
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
    // prettier-ignore
    const months: string[]=["january","february","march","april","may","june","july",
      "august", "september", "october", "november", "december"];

    try {
      const shiftID = this.shiftForm.value.shiftID;
      const shiftDate = new Date(this.shiftForm.value.shiftDate);
      const currentYear = shiftDate.getFullYear().toString();
      const currentMonth = months[shiftDate.getMonth()];

      const shiftData: Shift = {
        shiftID: this.shiftForm.value.shiftID,
        shiftDate: this.shiftForm.value.shiftDate,
        startTime: this.shiftForm.value.startTime,
        endTime: this.shiftForm.value.endTime,
        workplace: this.shiftForm.value.workplace,
        wagePerHour: Number(this.shiftForm.value.wagePerHour),
        shiftRevenue: Number(this.shiftForm.value.shiftRevenue),
        timeStamp: new Date(),
        userID: this.currentState.currentLoggedFireUser!.id,
        userInfo: {
          firstName: this.currentState.currentLoggedFireUser!.firstName,
          lastName: this.currentState.currentLoggedFireUser!.lastName,
        },
      };

      this.firestore.setFirestoreDoc(
        this.fbConfig.dev.shiftsDB,
        [currentYear, currentMonth, shiftID],
        shiftData
      );

      if (!this.isEditing) {
        this.toast.success(successMessages.firestore.shift.add);
      } else {
        this.toast.success(successMessages.firestore.shift.update);
      }

      this.router.navigate(['my-shifts']).then(() => {
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
