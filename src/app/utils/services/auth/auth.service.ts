import { Injectable } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { RegisterFormData } from 'src/app/pages/register/register.component';
import { calculateAge } from '../../functions';
import { userProfile } from '../../userProfile';
import { StateService } from '../state/state.service';
import { FirestoreService } from '../firestore/firestore.service';
import { firestoreConfig } from 'firebase.config';
import { Router } from '@angular/router';
import { State } from '../../Interfaces';
import { ToastService } from '../toast/toast.service';
import { errorMessages, successMessages } from '../../toastMessages';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { defaultStatsObject } from '../statistics/defaultStatsObject';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // state init
  currentState!: State;

  constructor(
    private auth: Auth,
    private state: StateService,
    private firestore: FirestoreService,
    private toast: ToastService,
    private router: Router
  ) {}

  //! CREATE ACCOUNT
  async register(data: RegisterFormData) {
    try {
      const { email, password, firstName, lastName, dob, termsAndConditions } =
        data;

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // add user information to firestore
      if (userCredential) {
        this.firestore
          .setFirestoreDoc(
            firestoreConfig.dev.usersDB,
            [userCredential.user.uid],
            {
              firstName,
              lastName,
              email,
              dob,
              age: calculateAge(dob),
              termsAndConditions,
              id: userCredential.user.uid,
              ...userProfile,
            }
          )
          .then(() => {
            // set basic user info in shiftsDB
            this.firestore.updateFirestoreDoc(
              firestoreConfig.dev.shiftsDB.base,
              [firestoreConfig.dev.shiftsDB.usersSubColl],
              {
                info: arrayUnion({
                  userID: userCredential.user.uid,
                  firstName,
                  lastName,
                }),
              }
            );

            // init statistics
            this.firestore.setFirestoreDoc(
              firestoreConfig.dev.statistics.base,
              [
                firestoreConfig.dev.statistics.users,
                userCredential.user.uid,
                new Date().getFullYear().toString(),
              ],
              defaultStatsObject
            );

            // add user information to state
            this.state.setState({
              currentLoggedFireUser: this.firestore.getFirestoreDoc(
                firestoreConfig.dev.usersDB,
                [userCredential.user.uid]
              ),
              currentUserCred: userCredential,
              isLoggedIn: true,
              loggedUserID: userCredential.user.uid,
            });
            this.currentState = this.state.getState();

            // add user information to localStorage
            this.firestore.setLocalStorage(
              'currentLoggedFireUser',
              this.currentState.currentLoggedFireUser
            );
          });
        return;
      }
      this.toast.success(successMessages.register);
    } catch (error) {
      console.log(error);

      this.toast.error(errorMessages.register);
    }
  }

  //! LOGIN
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userCredential) {
        // add user information to state
        this.state.setState({
          currentLoggedFireUser: await this.firestore.getFirestoreDoc(
            firestoreConfig.dev.usersDB,
            [userCredential.user.uid]
          ),
          currentUserCred: userCredential,
          isLoggedIn: true,
          loggedUserID: userCredential.user.uid,
        });
        this.currentState = this.state.getState();

        // add user information to localStorage
        this.firestore.setLocalStorage(
          'currentLoggedFireUser',
          this.currentState.currentLoggedFireUser
        );

        this.toast.success(successMessages.login);
        return userCredential;
      }
    } catch (error) {
      this.toast.error(errorMessages.login);
    }
    return null;
  }

  //! LOGOUT
  async logout() {
    await signOut(this.auth);
    this.state.resetState();
    this.firestore.clearLocalStorage();

    this.router.navigate(['/login']);

    return;
  }

  //! DELETE USER
  async deleteUserFromFirebase(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const user = this.auth.currentUser as User;

      // get user credentials
      const credentials = EmailAuthProvider.credential(email, password);

      // re auth user
      await reauthenticateWithCredential(user, credentials);

      // delete user info from firestore
      this.firestore.deleteFirestoreDoc(firestoreConfig.dev.usersDB, [
        user.uid,
      ]);
      // delete user shifts from firestore
      this.firestore.deleteFirestoreDoc(firestoreConfig.dev.shiftsDB.base, [
        firestoreConfig.dev.shiftsDB.shiftsSubColl,
        user.uid,
      ]);
      // remove basic user info from shifts BD
      this.firestore.updateFirestoreDoc(
        firestoreConfig.dev.shiftsDB.base,
        [firestoreConfig.dev.shiftsDB.usersSubColl],
        {
          info: arrayRemove({
            userID: user.uid,
            firstName,
            lastName,
          }),
        }
      );

      // init statistics
      this.firestore.deleteFirestoreDoc(firestoreConfig.dev.statistics.base, [
        firestoreConfig.dev.statistics.users,
        user.uid,
      ]);

      // delete user
      await deleteUser(user);

      // send succes toast if user was deleted and after 1 second,
      // logout the user end return in to login page
      this.toast.success(successMessages.deleteAccount);
      setTimeout(() => {
        this.state.resetState();
        this.router.navigate(['/login']);
      }, 1000);
    } catch (error) {
      this.toast.error(errorMessages.deleteAccount);
    }
  }

  //! firebase getLoggedUser
  async getUserState(): Promise<User | null> {
    return new Promise(async (resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in
          this.state.setState({
            currentLoggedFireUser: await this.firestore.getFirestoreDoc(
              firestoreConfig.dev.usersDB,
              [user.uid]
            ),
            emailVerified: user.emailVerified,
            currentUserCred: user,
            isLoggedIn: true,
          });
          resolve(user);

          // this.updateFirestoreDoc(firestoreConfig.dev.usersDB, [user.uid], {
          //   emailVerified: user.emailVerified,
          // });
        } else {
          // User is signed out
          resolve(null);
        }
        unsubscribe(); // unsubscribe after the first change
      });
    });
  }
}
