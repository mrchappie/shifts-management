import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firebaseConfig } from 'firebase.config';
import { UserSettings } from 'src/app/utils/Interfaces';
import { FirestoreService } from 'src/app/utils/services/firestore/firestore.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
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
        firebaseConfig.deploy.usersDB,
        [this.userIDFromURL]
      )) as UserSettings;
    })();
  }
}
