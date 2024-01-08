import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputType, formData } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { Shift, State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';

@Component({
  selector: 'app-handle-shifts',
  templateUrl: './handle-shifts.component.html',
  styleUrls: ['./handle-shifts.component.scss'],
})
export class HandleShiftsComponent implements OnInit {
  // parent component
  @Input() parent: string = 'my-shifts';

  currentState!: State;

  shiftForm!: FormGroup;
  shiftInputs: InputType[] = formData;
  userWorkplaces: string[] = [];
  isEditing: boolean = false;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private state: StateService,
    private DB: HandleDBService,
    private router: Router
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

    // check if url contains 'admin' keyword and sets isEditing state and userWorkplaces
    if (this.router.url.split('/').includes('admin')) {
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
      // this.isEditing = this.currentState.isEditing;
    });

    if (this.currentState.shiftToEdit) {
      this.shiftForm.patchValue(this.currentState.shiftToEdit);
    } else {
      this.shiftForm.patchValue({ shiftDate: this.getTodayDate() });
    }

    this.calculateRevenue();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  calculateRevenue() {
    this.shiftForm.get('wagePerHour')?.valueChanges.subscribe((wage) => {
      const MINUTES_PER_HOUR: number = 60;
      const HOURS_IN_DAY: number = 24;
      const startHours: string = this.shiftForm.value.startTime.split(':')[0];
      const startMinutes: string = this.shiftForm.value.startTime.split(':')[1];
      const endHours: string = this.shiftForm.value.endTime.split(':')[0];
      const endMinutes: string = this.shiftForm.value.endTime.split(':')[1];

      const startTimeMinutes: number =
        +startHours * MINUTES_PER_HOUR + +startMinutes;

      const endTimeMinutes: number = +endHours * MINUTES_PER_HOUR + +endMinutes;

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
    });
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formStatus(control: string) {
    if (control != 'dob') {
      return (
        this.shiftForm.get(control)?.invalid &&
        (this.shiftForm.get(control)?.dirty ||
          this.shiftForm.get(control)?.touched)
      );
    } else {
      return (
        (this.shiftForm.get(control)?.pristine &&
          this.shiftForm.get(control)?.touched) ||
        (this.shiftForm.get(control)?.touched &&
          this.shiftForm.get(control)?.dirty)
      );
    }
  }

  getErrorMessage(control: string) {
    if (this.shiftForm.get(control)?.hasError('required')) {
      return 'This field is required';
    }

    if (control === 'email') {
      if (this.shiftForm.get(control)?.hasError('pattern')) {
        return 'Provide a valid email adress';
      }
    }

    if (control === 'password') {
      if (this.shiftForm.get(control)?.hasError('pattern')) {
        return '8+ chars, uppercase, lowercase, digit, special char';
      }
    }

    if (control === 'confPass') {
      if (this.shiftForm.hasError('passwordsMisMatch')) {
        return 'Passwords do not match';
      }
    }

    if (control === 'firstName') {
      if (this.shiftForm.get(control)?.hasError('minlength')) {
        return 'First name must be longer than 2 chars';
      }
    }

    if (control === 'lastName') {
      if (this.shiftForm.get(control)?.hasError('minlength')) {
        return 'Last name must be longer than 2 chars';
      }
    }

    if (control === 'dob') {
      if (this.shiftForm.hasError('ageIsNotLegal')) {
        return 'Your age must be between 18 and 65 years';
      }
    }

    return '';
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

      this.DB.setFirestoreDoc(
        this.fbConfig.deploy.shiftsDB,
        [currentYear, currentMonth, shiftID],
        shiftData
      );

      this.router.navigate(['my-shifts']);
    } catch (error) {
      console.log(error);
    }
  }
}
