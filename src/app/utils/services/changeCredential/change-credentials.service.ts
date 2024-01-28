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
import { firestoreConfig } from 'firebase.config';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ChangeCredentialsService {
  constructor(
    private authService: AuthService,
    private auth: Auth,
    private toast: ToastService,
    private firestore: FirestoreService
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
      // console.log(error);
    }
  }

  //! RESET PASSWORD
  async resetPasswordEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.toast.success('Reset password email was sent.');
    } catch (error) {
      this.toast.error('Invalid email, please try again.');
      // console.log(error);
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

      this.firestore.updateFirestoreDoc(
        firestoreConfig.firestore.usersDB,
        [user.uid],
        {
          email: newEmail,
        }
      );

      this.authService.logout();
    } catch (error) {
      this.toast.warning('Please verify the new email before changing email.');
    }
  }

  //! VERIFY EMAIL
  async verifyUserEmail() {
    try {
      const user = this.auth.currentUser as User;
      await sendEmailVerification(user);
      this.toast.warning('Email verification sent!');
    } catch (error) {
      // console.log(error);
    }
  }
}
