import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { firebaseConfig } from 'firebase.config';
import { UserSettings } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';

@Component({
  selector: 'app-admin-rights',
  templateUrl: './admin-rights.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class AdminRightsComponent implements OnInit {
  @Input() userID: string = '';
  @Input() userData!: UserSettings | null;
  protected adminRightsForm!: FormGroup;

  constructor(private DB: FirestoreService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.adminRightsForm = this.fb.group({
      isAdmin: false,
    });

    this.setFormValue();

    this.adminRightsForm.get('isAdmin')?.valueChanges.subscribe((newValue) => {
      this.onSubmit(newValue);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userData) {
      this.setFormValue();
    }
  }

  private setFormValue() {
    if (this.userData) {
      this.adminRightsForm
        .get('isAdmin')
        ?.setValue(this.userData.adminPanel.isAdmin);
    }
  }

  async onSubmit(isAdminF: boolean) {
    await this.DB.updateFirestoreDoc(
      firebaseConfig.dev.usersDB,
      [this.userID],
      { adminPanel: { isAdmin: isAdminF } }
    );
  }
}
