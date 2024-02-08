import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { ChangeCredentialsService } from 'src/app/utils/services/changeCredential/change-credentials.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ValidationService } from './validationService/validation.service';
import { validationPatterns } from 'src/app/utils/validationData';
import { ButtonIconComponent } from 'src/app/components/UI/button/button-icon/button-icon.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIf,
    RouterLink,
    ButtonIconComponent,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  resetPassword!: FormGroup;
  currentUser!: UserCredential;
  showResetModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firestore: FirestoreService,
    private authService: AuthService,
    private changeCred: ChangeCredentialsService,
    private validation: ValidationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.firestore.getLocalStorage('userCredentials');

    // login form
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(validationPatterns.login.email),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // reset passeord form
    this.resetPassword = this.fb.group({
      resetPasswordEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(validationPatterns.login.email),
        ],
      ],
    });
  }

  // form validation service
  formInputStatus(control: string): boolean {
    return this.validation.getFormInputStatus(this.loginForm, control);
  }
  getErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.loginForm, control);
  }
  formResetStatus(control: string): boolean {
    return this.validation.getFormInputStatus(this.resetPassword, control);
  }
  getResetErrorMessage(control: string): string {
    return this.validation.getErrorMessage(this.resetPassword, control);
  }

  async onSubmit() {
    await this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  async loginWithProvider(provider: string) {
    if (provider === 'google') {
      await this.authService.authWithGoogle();
    }
  }

  openModal(event: Event) {
    event.preventDefault();
    this.toggleModal();
  }

  closeModal(event: Event) {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      this.toggleModal();
    }
  }

  async sendResetEmail(email: string) {
    try {
      await this.changeCred.resetPasswordEmail(email);
      this.toggleModal();
    } catch (error) {
      // console.log(error);
    }
  }

  toggleModal() {
    this.showResetModal = !this.showResetModal;
  }
}
