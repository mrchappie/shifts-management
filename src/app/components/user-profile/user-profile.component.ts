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
import { firestoreConfig } from 'firebase.config';
import { AgeValidation } from 'src/app/utils/customValidators/ageValidation';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { errorMessages, successMessages } from 'src/app/utils/toastMessages';
import { ToastService } from 'src/app/utils/services/toast/toast.service';
import { calculateAge } from 'src/app/utils/functions';
import { ValidationService } from './validationService/validation.service';
import { validationPatterns } from 'src/app/utils/validationData';
import { BackdropComponent } from '../UI/backdrop/backdrop.component';
import { StorageService } from 'src/app/utils/services/storage/storage.service';
import { ButtonSubmitComponent } from '../UI/button/button-submit/button-submit.component';

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
    ButtonSubmitComponent,
  ],
})
export class UserProfileComponent {
  // component
  currentState!: State;
  settingsFormInputs: SettingsForm[] = settingsFormData;
  userSettings!: UserSettings;
  profileImage: string = '';
  userIDFromParams!: string;
  userProfileForm!: FormGroup;
  showPhotosModal: boolean = false;

  profileAvatars: string[] = [];

  private stateSubscription: Subscription | undefined;

  constructor(
    private state: StateService,
    private firestore: FirestoreService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private validation: ValidationService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    // get the user ID from URL if an admin edits a user
    this.route.queryParams.subscribe(
      (params) => (this.userIDFromParams = params.userID)
    );

    // init state
    this.currentState = this.state.getState();

    // init form
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

    // get current logged user data
    if (!this.userIDFromParams) {
      this.getUserData(this.currentState.currentLoggedFireUser!.id);
      this.profileImage = this.currentState.currentLoggedFireUser!.profileImage;
      this.userIDFromParams = this.currentState.currentLoggedFireUser!.id;
    } else {
      this.getUserData(this.userIDFromParams);
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      if (
        this.userIDFromParams === this.currentState.currentLoggedFireUser?.id
      ) {
        this.profileImage =
          this.currentState.currentLoggedFireUser!.profileImage;
      }
    });

    this.getAvatarsFromDB();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  async getUserData(userIDFromParams: string) {
    this.userSettings = (await this.firestore.getFirestoreDoc(
      firestoreConfig.firestore.usersDB,
      [userIDFromParams]
    )) as UserSettings;
    this.profileImage = this.userSettings.profileImage;

    if (!this.userSettings) {
      this.router.navigate(['404']);
    }

    // update the state only when there is no userIDFromParams param
    if (!this.userIDFromParams) {
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
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        // profile photo name will be the user name
        const photoName =
          this.userSettings.firstName + '_' + this.userSettings.lastName;
        // upload the image to firebase storage
        await this.storage.uploadFile(fileList[0], photoName, [
          firestoreConfig.storage.profileImages,
        ]);
        // get the image url
        const imageUrl = await this.storage.getUrl([
          firestoreConfig.storage.profileImages,
          photoName,
        ]);

        // update de user profile picture in firestore
        this.firestore.updateFirestoreDoc(
          firestoreConfig.firestore.usersDB,
          [this.userIDFromParams],
          {
            profileImage: imageUrl,
          }
        );

        if (!this.userIDFromParams) {
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
      this.toast.success('Profile picture was updated successfully!');
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  // get avatar urls
  async getAvatarsFromDB() {
    const urls = await this.storage.getUrls([
      firestoreConfig.storage.profileAvatars,
    ]);
    const tempArr = urls.filter((item) => item != null) as string[];

    const userProfileImage = await this.storage.getUrl([
      firestoreConfig.storage.profileImages,
      `${this.userSettings.firstName}_${this.userSettings.lastName}`,
    ]);

    this.profileAvatars.push(...tempArr);
    this.profileAvatars.unshift(userProfileImage ?? '');
  }

  // change profile avatar
  changeProfileAvatar(avatar: string) {
    try {
      this.firestore.updateFirestoreDoc(
        firestoreConfig.firestore.usersDB,
        [this.userIDFromParams],
        {
          profileImage: avatar,
        }
      );

      // update the state if userID coresponds to userID from existing state
      // this is made to update in real time the photo from navigation also
      if (
        this.userIDFromParams === this.currentState.currentLoggedFireUser?.id
      ) {
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
      this.toast.success('Profile picture was updated successfully!');
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  // form validation service
  formInputStatus(control: string): boolean {
    return this.validation.getFormInputStatus(this.userProfileForm, control);
  }
  getErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.userProfileForm, control);
  }

  async onSubmit() {
    try {
      if (!this.userIDFromParams) {
        await this.firestore.updateFirestoreDoc(
          firestoreConfig.firestore.usersDB,
          [this.currentState.currentLoggedFireUser!.id],
          {
            ...this.userProfileForm.value,
            age: calculateAge(this.userProfileForm.get('dob')?.value),
          }
        );
        this.state.setState(this.userProfileForm.value);
      } else {
        await this.firestore.updateFirestoreDoc(
          firestoreConfig.firestore.usersDB,
          [this.userIDFromParams],
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
