import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeCredentialsService } from 'src/app/utils/services/changeCredential/change-credentials.service';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';

@Component({
  standalone: true,
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
})
export class ChangeCredentialsComponent implements OnInit {
  changePasswordForm!: FormGroup;
  changeEmailForm!: FormGroup;
  showModal: boolean = false;
  changeType: string = '';

  constructor(
    private changeCred: ChangeCredentialsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required]],
      oldPass: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      confNewPass: ['', [Validators.required]],
    });

    this.changeEmailForm = this.fb.group({
      oldEmail: ['', [Validators.required]],
      newEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  closeModal(event: Event) {
    event.stopPropagation();

    if (event.target === event.currentTarget) {
      this.showModal = !this.showModal;
    }
  }

  openModal(event: Event, changeType: string) {
    event.stopPropagation();

    this.changeType = changeType;
    this.showModal = !this.showModal;
  }

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
  }

  verifyEmail() {
    this.changeCred.verifyUserEmail();
  }
}
