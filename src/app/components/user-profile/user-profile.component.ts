import { Component } from '@angular/core';
import { State, UserSettings } from 'src/app/utils/Interfaces';
import { SettingsForm, settingsFormData } from './formData';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { AgeValidation } from 'src/app/pages/register/customValidators/ageValidation';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { calculateAge } from 'src/app/utils/functions';
import { ValidationService } from './validationService/validation.service';
import { validationPatterns } from 'src/app/utils/validationData';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, MatIconModule],
})
export class UserProfileComponent {
  currentState!: State;
  settingsFormInputs: SettingsForm[] = settingsFormData;
  userSettings!: UserSettings;
  profileImage: string = '';
  userIDFromURL!: string;
  userProfileForm!: FormGroup;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private DB: FirestoreService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private validation: ValidationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (param) => (this.userIDFromURL = param['userID'])
    );

    this.userProfileForm = this.fb.group({
      userName: [''],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      dob: ['', [Validators.required, AgeValidation]],
      phoneNumber: [
        '',
        [
          Validators.pattern(validationPatterns.profile.phoneNumber),
          Validators.minLength(10),
        ],
      ],
    });

    this.currentState = this.state.getState();

    if (!this.userIDFromURL) {
      this.getUserData(this.currentState.currentLoggedFireUser!.id);
    } else {
      this.getUserData(this.userIDFromURL);
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getUserData(userID: string) {
    this.userSettings = (await this.DB.getFirestoreDoc(
      this.fbConfig.dev.usersDB,
      [userID]
    )) as UserSettings;

    if (!this.userSettings) {
      this.router.navigate(['404']);
    }

    // update the state only when there is no userID param
    if (!this.userIDFromURL) {
      // update state with user info
      this.state.setState({
        currentLoggedFireUser: this.userSettings,
      });
    }

    // update form if user info exists
    if (this.userSettings) {
      this.profileImage = this.userSettings.profileImage;
      this.userProfileForm.patchValue(this.userSettings);
    }
  }

  // form validation service
  formStatus(control: string): boolean {
    return this.validation.getFormStatus(this.userProfileForm, control);
  }
  getErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.userProfileForm, control);
  }

  async onSubmit() {
    try {
      if (!this.userIDFromURL) {
        await this.DB.updateFirestoreDoc(
          this.fbConfig.dev.usersDB,
          [this.currentState.currentLoggedFireUser!.id],
          {
            ...this.userProfileForm.value,
            age: calculateAge(this.userProfileForm.get('dob')?.value),
          }
        );
        this.state.setState(this.userProfileForm.value);
      } else {
        await this.DB.updateFirestoreDoc(
          this.fbConfig.dev.usersDB,
          [this.userIDFromURL],
          {
            ...this.userProfileForm.value,
            age: calculateAge(this.userProfileForm.get('dob')?.value),
          }
        );
      }
      this.toast.success(successMessages.firestore.profile.update);
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }
}
