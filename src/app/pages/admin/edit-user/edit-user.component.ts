import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firebaseConfig } from 'firebase.config';
import { DividerComponent } from 'src/app/components/UI/divider/divider.component';
import { SectionHeadingComponent } from 'src/app/components/UI/section-heading/section-heading.component';
import { AddWorkplaceComponent } from 'src/app/components/add-workplace/add-workplace.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { UserSettings } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { AdminRightsComponent } from '../components/admin-rights/admin-rights.component';
import { MyShiftsComponent } from '../../my-shifts/my-shifts.component';

@Component({
  standalone: true,
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  imports: [
    NgIf,
    SectionHeadingComponent,
    UserProfileComponent,
    DividerComponent,
    AddWorkplaceComponent,
    AdminRightsComponent,
    MyShiftsComponent,
  ],
})
export class EditUserComponent {
  loadShifts: boolean = false;
  userIDFromURL: string = '';
  userData!: UserSettings | null;

  constructor(private route: ActivatedRoute, private DB: FirestoreService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (param) => (this.userIDFromURL = param['userID'])
    );

    (async () => {
      this.userData = (await this.DB.getFirestoreDoc(
        firebaseConfig.dev.usersDB,
        [this.userIDFromURL]
      )) as UserSettings;
    })();
  }
}
