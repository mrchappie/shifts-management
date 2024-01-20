import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { DeleteAccount, deleteAccount } from './formData';
import { ValidationService } from './validationService/validation.service';
import { validationPatterns } from 'src/app/utils/validationData';
import { UserSettings } from 'src/app/utils/Interfaces';

@Component({
  standalone: true,
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule],
})
export class DeleteAccountComponent implements OnInit {
  deleteAccountForm!: FormGroup;
  showModal: boolean = false;
  deleteAccount: DeleteAccount[] = deleteAccount;
  @Input() userSettings!: UserSettings;

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.deleteAccountForm = this.fb.group({
      email: [
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
  formStatus(control: string) {
    return this.validation.getFormInputStatus(this.deleteAccountForm, control);
  }
  getErrorMessage(control: string) {
    return this.validation.getErrorMessage(this.deleteAccountForm, control);
  }

  // toggle modal for credentials
  closeModal(event: Event) {
    event.stopPropagation();

    if (event.target === event.currentTarget) {
      this.showModal = !this.showModal;

      // resseting the forms when the modal is closed
      this.deleteAccountForm.reset();
    }
  }

  openModal(event: Event) {
    event.stopPropagation();

    this.showModal = !this.showModal;
  }

  deleteAccountFn(event: Event) {
    event.stopPropagation();
    this.auth.deleteUserFromFirebase(
      this.deleteAccountForm.value.email,
      this.deleteAccountForm.value.password,
      this.userSettings.firstName,
      this.userSettings.lastName
    );

    this.showModal = !this.showModal;
  }
}
