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
import { BackdropComponent } from '../UI/backdrop/backdrop.component';
import { StorageService } from 'src/app/utils/services/storage/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatIconModule,
    BackdropComponent,
  ],
})
export class UserProfileComponent {
  // component
  currentState!: State;
  settingsFormInputs: SettingsForm[] = settingsFormData;
  userSettings!: UserSettings;
  profileImage: string = '';
  userID!: string;
  userProfileForm!: FormGroup;
  showPhotosModal: boolean = false;

  profileAvatars: string[] = [];

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
    private validation: ValidationService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    // get the user ID from URL if an admin edits a user
    this.route.params.subscribe((param) => (this.userID = param['userID']));

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

    // init state
    this.currentState = this.state.getState();

    // get current logged user data
    if (!this.userID) {
      this.getUserData(this.currentState.currentLoggedFireUser!.id);
      this.profileImage = this.currentState.currentLoggedFireUser!.profileImage;
      this.userID = this.currentState.currentLoggedFireUser!.id;
    } else {
      this.getUserData(this.userID);
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.profileImage = this.currentState.currentLoggedFireUser!.profileImage;
    });

    this.getAvatarsFromDB();
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
    this.profileImage = this.userSettings.profileImage;

    if (!this.userSettings) {
      this.router.navigate(['404']);
    }

    // update the state only when there is no userID param
    if (!this.userID) {
      // update state with user info
      this.state.setState({
        currentLoggedFireUser: this.userSettings,
      });
    }

    // update form if user info exists
    if (this.userSettings) {
      this.userProfileForm.patchValue(this.userSettings);
    }
  }

  // toggle change picture modal
  openAvatarsModal(event: Event) {
    event.stopPropagation();
    this.showPhotosModal = !this.showPhotosModal;
  }

  closeAvatarsModal(event: Event) {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      this.showPhotosModal = !this.showPhotosModal;
    }
  }

  // upload profile picture
  async uploadFile(event: Event) {
    // get the current index of profile picture from array of avatars

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      // profile photo name will be the user name
      const photoName =
        this.userSettings.firstName + '_' + this.userSettings.lastName;
      // upload the image to firebase storage
      await this.storage.uploadFile(fileList[0], photoName, [
        firebaseConfig.storage.profileImages,
      ]);
      // get the image url
      const imageUrl = await this.storage.getUrl([
        firebaseConfig.storage.profileImages,
        photoName,
      ]);

      // update de user profile picture in DB
      this.DB.updateFirestoreDoc(firebaseConfig.dev.usersDB, [this.userID], {
        profileImage: imageUrl,
      });

      if (!this.userID) {
        // update de user profile picture in state
        this.state.setState({
          currentLoggedFireUser: {
            ...this.userSettings,
            profileImage: imageUrl,
          },
        });
      }

      this.profileImage = imageUrl as string;

      // hide modal after a photo upload
      this.showPhotosModal = false;
    }
  }

  // get avatar urls
  async getAvatarsFromDB() {
    const urls = await this.storage.getUrls([
      firebaseConfig.storage.profileAvatars,
    ]);
    const tempArr = urls.filter((item) => item != null) as string[];

    const userProfileImage = await this.storage.getUrl([
      firebaseConfig.storage.profileImages,
      `${this.userSettings.firstName}_${this.userSettings.lastName}`,
    ]);

    this.profileAvatars.push(...tempArr);
    this.profileAvatars.unshift(userProfileImage ?? '');
  }

  // change profile avatar
  changeProfileAvatar(avatar: string) {
    this.DB.updateFirestoreDoc(firebaseConfig.dev.usersDB, [this.userID], {
      profileImage: avatar,
    });
    //! BUG
    if (!this.userID) {
      this.state.setState({
        currentLoggedFireUser: {
          ...this.userSettings,
          profileImage: avatar,
        },
      });
    }

    this.profileImage = avatar as string;

    // hide modal after a photo change
    this.showPhotosModal = false;
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
      if (!this.userID) {
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
          [this.userID],
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
