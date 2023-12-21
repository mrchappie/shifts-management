import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputType, formData } from './formData';
import { StateService } from 'src/app/utils/services/state/state.service';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { State } from 'src/app/utils/Interfaces';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { getCurrentYearMonth } from 'src/app/utils/functions';

@Component({
  selector: 'app-handle-shifts',
  templateUrl: './handle-shifts.component.html',
  styleUrls: ['./handle-shifts.component.scss'],
})
export class HandleShiftsComponent implements OnInit {
  currentState!: State;

  shiftForm!: FormGroup;
  shiftInputs: InputType[] = formData;
  userWorkplaces: string[] | undefined = [];
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
      startTime: ['08:00'],
      endTime: ['20:00'],
      workplace: [''],
      wagePerHour: [''],
      shiftRevenue: [''],
    });

    this.calculateRevenue();

    this.currentState = this.state.getState();
    this.isEditing = this.currentState.isEditing;
    this.userWorkplaces =
      this.currentState.currentLoggedFireUser?.userWorkplaces;

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.isEditing = this.currentState.isEditing;
    });

    if (this.currentState.shiftToEdit) {
      this.shiftForm.patchValue(this.currentState.shiftToEdit);
    } else {
      this.shiftForm.patchValue({ shiftDate: this.getTodayDate() });
    }
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  calculateRevenue() {
    ['wagePerHour'].forEach((field) => {
      this.shiftForm.get(field)?.valueChanges.subscribe((wage) => {
        const MINUTES_PER_HOUR: number = 60;
        const HOURS_IN_DAY: number = 24;
        const startHours: string = this.shiftForm.value.startTime.split(':')[0];
        const startMinutes: string =
          this.shiftForm.value.startTime.split(':')[1];
        const endHours: string = this.shiftForm.value.endTime.split(':')[0];
        const endMinutes: string = this.shiftForm.value.endTime.split(':')[1];

        const startTimeMinutes: number =
          +startHours * MINUTES_PER_HOUR + +startMinutes;

        const endTimeMinutes: number =
          +endHours * MINUTES_PER_HOUR + +endMinutes;

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
    });
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
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

      this.DB.setFirestoreDoc(
        this.fbConfig.deploy.shiftsDB,
        [currentYear, currentMonth, shiftID],
        {
          ...this.shiftForm.value,
          shiftID,
          timeStamp: new Date(),
          userID: this.currentState.currentLoggedFireUser?.id,
          userInfo: {
            firstName: this.currentState.currentLoggedFireUser?.firstName,
            lastName: this.currentState.currentLoggedFireUser?.lastName,
          },
        }
      );

      this.router.navigate(['my-shifts']);
    } catch (error) {
      console.log(error);
    }
  }
}
