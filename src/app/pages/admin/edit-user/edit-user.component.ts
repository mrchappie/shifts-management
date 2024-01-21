import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firestoreConfig } from 'firebase.config';
import { UserSettings } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';
import { MyShiftsComponent } from '../../my-shifts/my-shifts.component';
import { NgIf } from '@angular/common';
import { AdminRightsComponent } from '../components/admin-rights/admin-rights.component';
import { DividerComponent } from '../../../components/UI/divider/divider.component';
import { UserProfileComponent } from '../../../components/user-profile/user-profile.component';
import { SectionHeadingComponent } from '../../../components/UI/section-heading/section-heading.component';
import { AddWorkplaceComponent } from 'src/app/components/user-profile/add-workplace/add-workplace.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: true,
  imports: [
    SectionHeadingComponent,
    UserProfileComponent,
    DividerComponent,
    AddWorkplaceComponent,
    AdminRightsComponent,
    NgIf,
    MyShiftsComponent,
  ],
})
export class EditUserComponent {
  loadShifts: boolean = false;
  userIDFromURL: string = '';
  userData!: UserSettings | null;

  constructor(
    private route: ActivatedRoute,
    private firestore: FirestoreService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (param) => (this.userIDFromURL = param['userID'])
    );

    (async () => {
      this.userData = (await this.firestore.getFirestoreDoc(
        firestoreConfig.dev.usersDB,
        [this.userIDFromURL]
      )) as UserSettings;
    })();
  }
}
