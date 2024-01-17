import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { RegisterFormData } from 'src/app/pages/register/register.component';
import { calculateAge } from '../../functions';
import { userProfile } from '../../userProfile';
import { StateService, initialState } from '../state/state.service';
import { FirestoreService } from '../firestore/firestore.service';
import { FirebaseConfigI, firestoreConfig } from 'firebase.config';
import { Router } from '@angular/router';
import { State } from '../../Interfaces';
import { ToastService } from '../toast/toast.service';
import { errorMessages, successMessages } from '../../toastMessages';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // state init
  currentState!: State;

  // firestore Config
  fbConfig: FirebaseConfigI = firestoreConfig;

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
        this.firestore.setFirestoreDoc(
          this.fbConfig.dev.usersDB,
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
        );

        // add user information to state
        this.state.setState({
          currentLoggedFireUser: this.firestore.getFirestoreDoc(
            this.fbConfig.dev.usersDB,
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

        return;
      }
      this.toast.success(successMessages.register);
    } catch (error) {
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
            this.fbConfig.dev.usersDB,
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
    this.state.setState(initialState);
    this.firestore.clearLocalStorage();

    this.router.navigate(['/login']);

    return;
  }

  //! firebase getLoggedUser
  async getUserState(): Promise<User | null> {
    return new Promise(async (resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in
          this.state.setState({
            currentLoggedFireUser: await this.firestore.getFirestoreDoc(
              this.fbConfig.dev.usersDB,
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
