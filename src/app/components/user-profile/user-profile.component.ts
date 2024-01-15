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

  profileAvatars: (string | null)[] = [];

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
      phoneNumber: ['', [Validators.pattern(/[0-9]{10}/)]],
    });

    // init state
    this.currentState = this.state.getState();

    // get current logged user data
    if (!this.userID) {
      this.getUserData(this.currentState.currentLoggedFireUser!.id);
      this.profileAvatars.push(
        this.currentState.currentLoggedFireUser!.profileImage
      );
      this.profileImage = this.currentState.currentLoggedFireUser!.profileImage;
    } else {
      this.getUserData(this.userID);
    }

    this.stateSubscription = this.state.stateChanged.subscribe((newState) => {
      this.currentState = newState;
      this.profileImage = this.currentState.currentLoggedFireUser!.profileImage;
    });

    this.getUrlsFromDB();
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
    const initialIndexOfImage = this.profileAvatars.indexOf(this.profileImage);

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

      if (initialIndexOfImage) {
        this.profileAvatars = this.profileAvatars.splice(
          initialIndexOfImage,
          1,
          imageUrl
        );
      }
    }
  }

  // get avatar urls
  async getUrlsFromDB() {
    const urls = await this.storage.getUrls();
    this.profileAvatars.push(...urls!.filter((item) => item != null));
  }

  // change profile avatar
  changeProfileAvatar(avatar: string | null) {
    this.DB.updateFirestoreDoc(firebaseConfig.dev.usersDB, [this.userID], {
      profileImage: avatar,
    });

    if (!this.userID) {
      this.state.setState({
        currentLoggedFireUser: {
          ...this.userSettings,
          profileImage: avatar,
        },
      });
    }

    this.profileImage = avatar as string;
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

    return '';
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
