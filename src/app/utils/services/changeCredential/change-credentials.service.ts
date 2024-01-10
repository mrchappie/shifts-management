import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
  updateEmail,
  sendEmailVerification,
} from '@angular/fire/auth';
import { firebaseConfig } from 'firebase.config';
import { AuthService } from '../auth/auth.service';
import { ToastService } from 'angular-toastify';
import { HandleDBService } from '../handleDB/handle-db.service';

@Injectable({
  providedIn: 'root',
})
export class ChangeCredentialsService {
  constructor(
    private authService: AuthService,
    private auth: Auth,
    private _toastService: ToastService,
    private DB: HandleDBService
  ) {}

  //! SET PASSWORD
  async setUserPassword(email: string, oldPass: string, newPass: string) {
    try {
      const user = this.auth.currentUser as User;
      const credentials = EmailAuthProvider.credential(email, oldPass);
      await reauthenticateWithCredential(user, credentials);

      await updatePassword(user, newPass);
      this.authService.logout();
    } catch (error) {
      console.log(error);
    }
  }

  //! RESET PASSWORD
  async resetPasswordEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this._toastService.success('Reset password email was sent.');
    } catch (error) {
      this._toastService.error('Invalid email, please try again.');
      console.log(error);
    }
  }

  //! SET EMAIL
  async setUserEmail(oldEmail: string, newEmail: string, password: string) {
    try {
      const user = this.auth.currentUser as User;

      const credentials = EmailAuthProvider.credential(oldEmail, password);
      await reauthenticateWithCredential(user, credentials);
      // this.verifyUserEmail();
      await updateEmail(user, newEmail);

      this.DB.updateFirestoreDoc(firebaseConfig.dev.usersDB, [user.uid], {
        email: newEmail,
      });

      this.authService.logout();
    } catch (error) {
      console.log(error);
    }
  }

  //! VERIFY EMAIL
  async verifyUserEmail() {
    try {
      const user = this.auth.currentUser as User;
      await sendEmailVerification(user);
      this._toastService.warn('Email verification sent!');
    } catch (error) {
      console.log(error);
    }
  }
}
