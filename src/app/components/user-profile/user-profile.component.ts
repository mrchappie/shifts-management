import { Component } from '@angular/core';
import { State, UserSettings } from 'src/app/utils/Interfaces';
import { SettingsForm, settingsFormData } from './formData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { AgeValidation } from 'src/app/pages/register/customValidators/ageValidation';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
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
    private DB: HandleDBService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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
      phoneNumber: ['', [Validators.required, Validators.pattern(/[0-9]{10}/)]],
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

  formStatus(control: string) {
    if (control != 'dob') {
      return (
        this.userProfileForm.get(control)?.invalid &&
        (this.userProfileForm.get(control)?.dirty ||
          this.userProfileForm.get(control)?.touched)
      );
    } else {
      return (
        this.userProfileForm.get(control)?.invalid &&
        ((this.userProfileForm.get(control)?.touched &&
          this.userProfileForm.get(control)?.dirty) ||
          (this.userProfileForm.get(control)?.untouched &&
            this.userProfileForm.get(control)?.dirty) ||
          (this.userProfileForm.get(control)?.touched &&
            this.userProfileForm.get(control)?.pristine))
      );
    }
  }

  getErrorMessage(control: string) {
    if (this.userProfileForm.get(control)?.hasError('required')) {
      return 'This field is required';
    }

    if (control === 'firstName') {
      if (this.userProfileForm.get(control)?.hasError('minlength')) {
        return 'First name must be longer than 2 chars';
      }
    }

    if (control === 'lastName') {
      if (this.userProfileForm.get(control)?.hasError('minlength')) {
        return 'Last name must be longer than 2 chars';
      }
    }

    if (control === 'dob') {
      if (this.userProfileForm.get(control)?.hasError('ageIsNotLegal')) {
        return 'Your age must be between 18 and 65 years';
      }
    }

    if (control === 'phoneNumber') {
      if (this.userProfileForm.get(control)?.hasError('pattern')) {
        return 'Provide a valid phone number';
      }
    }

    return '';
  }

  async onSubmit() {
    if (!this.userIDFromURL) {
      await this.DB.updateFirestoreDoc(
        this.fbConfig.dev.usersDB,
        [this.currentState.currentLoggedFireUser!.id],
        this.userProfileForm.value
      );
      this.state.setState(this.userProfileForm.value);
    } else {
      await this.DB.updateFirestoreDoc(
        this.fbConfig.dev.usersDB,
        [this.userIDFromURL],
        this.userProfileForm.value
      );
    }
  }
}
