import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PasswordValidator } from 'src/app/utils/customValidators/confirmPassword';
import { ChangeCredentialsService } from 'src/app/utils/services/changeCredential/change-credentials.service';
import { validationPatterns } from 'src/app/utils/validationData';
import { ValidationService } from './validationService/validation.service';
import {
  ChangeCredentials,
  changeEmailFormInputs,
  changePassFormInputs,
} from './formData';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { ButtonIconComponent } from '../../UI/button/button-icon/button-icon.component';

@Component({
  standalone: true,
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, ButtonIconComponent],
})
export class ChangeCredentialsComponent implements OnInit {
  changePasswordForm!: FormGroup;
  changeEmailForm!: FormGroup;
  showModal: boolean = false;
  changeType: string = '';
  // forms data
  changePasswordFormData: ChangeCredentials[] = changePassFormInputs;
  changeEmailFormData: ChangeCredentials[] = changeEmailFormInputs;

  constructor(
    private changeCred: ChangeCredentialsService,
    private fb: FormBuilder,
    private validation: ValidationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(validationPatterns.credentials.email),
          ],
        ],
        oldPass: ['', [Validators.required, Validators.minLength(8)]],
        newPass: [
          '',
          [
            Validators.required,
            Validators.pattern(validationPatterns.credentials.password),
          ],
        ],
        confNewPass: ['', [Validators.required]],
      },
      {
        validators: [PasswordValidator('newPass', 'confNewPass')],
      }
    );

    this.changeEmailForm = this.fb.group({
      oldEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(validationPatterns.credentials.email),
        ],
      ],
      newEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(validationPatterns.credentials.email),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // form validation service
  // Password
  formStatusPassword(control: string) {
    return this.validation.getFormInputStatus(this.changePasswordForm, control);
  }
  getErrorMessagePassword(control: string) {
    return this.validation.getPasswordErrorMessage(
      this.changePasswordForm,
      control
    );
  }
  // Email
  formStatusEmail(control: string) {
    return this.validation.getFormInputStatus(this.changeEmailForm, control);
  }
  getErrorMessageEmail(control: string) {
    return this.validation.getEmailErrorMessage(this.changeEmailForm, control);
  }

  // toggle modal for credentials
  closeModal(event: Event) {
    event.stopPropagation();

    if (event.target === event.currentTarget) {
      this.showModal = !this.showModal;

      // resseting the forms when the modal is closed
      this.changePasswordForm.reset();
      this.changeEmailForm.reset();
    }
  }

  openModal(event: Event, changeType: string) {
    event.stopPropagation();

    this.changeType = changeType;
    this.showModal = !this.showModal;
  }

  // change credentials
  changeCredential(event: Event, type: string) {
    event.stopPropagation();

    if (type === 'password') {
      this.changeCred.setUserPassword(
        this.changePasswordForm.value.email,
        this.changePasswordForm.value.oldPass,
        this.changePasswordForm.value.newPass
      );
    }

    if (type === 'email') {
      this.changeCred.setUserEmail(
        this.changeEmailForm.value.oldEmail,
        this.changeEmailForm.value.newEmail,
        this.changeEmailForm.value.password
      );
    }

    this.showModal = !this.showModal;
  }

  verifyEmail() {
    this.changeCred.verifyUserEmail();
  }
}
