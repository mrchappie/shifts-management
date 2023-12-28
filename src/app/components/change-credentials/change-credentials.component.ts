import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';
import { StateService } from 'src/app/utils/services/state/state.service';

@Component({
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  styleUrls: ['./change-credentials.component.scss'],
})
export class ChangeCredentialsComponent implements OnInit {
  changePasswordForm!: FormGroup;
  changeEmailForm!: FormGroup;
  showModal: boolean = false;
  changeType: string = '';

  constructor(private DB: HandleDBService, private fb: FormBuilder) {}

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
      this.DB.setUserPassword(
        this.changePasswordForm.value.email,
        this.changePasswordForm.value.oldPass,
        this.changePasswordForm.value.newPass
      );
    }

    if (type === 'email') {
      this.DB.setUserEmail(this.changeEmailForm.value.newEmail);
    }
  }
}
