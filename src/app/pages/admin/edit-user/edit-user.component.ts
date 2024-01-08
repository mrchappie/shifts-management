import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firebaseConfig } from 'firebase.config';
import { UserSettings } from 'src/app/utils/Interfaces';
import { HandleDBService } from 'src/app/utils/services/handleDB/handle-db.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  loadShifts: boolean = false;
  userIDFromURL: string = '';
  userData!: UserSettings | null;

  constructor(private route: ActivatedRoute, private DB: HandleDBService) {}

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
