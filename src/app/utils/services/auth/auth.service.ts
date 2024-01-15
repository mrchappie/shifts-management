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
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';
import { State } from '../../Interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // state init
  currentState!: State;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  constructor(
    private auth: Auth,
    private state: StateService,
    private DB: FirestoreService,
    private _toastService: ToastService,
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
        this.DB.setFirestoreDoc(
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
          currentLoggedFireUser: this.DB.getFirestoreDoc(
            this.fbConfig.dev.usersDB,
            [userCredential.user.uid]
          ),
          currentUserCred: userCredential,
          isLoggedIn: true,
          loggedUserID: userCredential.user.uid,
        });
        this.currentState = this.state.getState();

        // add user information to localStorage
        this.DB.setLocalStorage(
          'currentLoggedFireUser',
          this.currentState.currentLoggedFireUser
        );
      }
    } catch (error) {
      console.log(error);
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

      // add user information to state
      this.state.setState({
        currentLoggedFireUser: await this.DB.getFirestoreDoc(
          this.fbConfig.dev.usersDB,
          [userCredential.user.uid]
        ),
        currentUserCred: userCredential,
        isLoggedIn: true,
        loggedUserID: userCredential.user.uid,
      });
      this.currentState = this.state.getState();

      // add user information to localStorage
      this.DB.setLocalStorage(
        'currentLoggedFireUser',
        this.currentState.currentLoggedFireUser
      );

      this._toastService.success('Login successfully!');
      return userCredential;
    } catch (error) {
      this._toastService.error('Invalid credentials, please try again!');
    }
    return null;
  }

  //! LOGOUT
  async logout() {
    await signOut(this.auth);
    this.state.setState(initialState);
    this.DB.clearLocalStorage();

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
            currentLoggedFireUser: await this.DB.getFirestoreDoc(
              this.fbConfig.dev.usersDB,
              [user.uid]
            ),
            emailVerified: user.emailVerified,
            currentUserCred: user,
            isLoggedIn: true,
          });
          resolve(user);

          // this.updateFirestoreDoc(firebaseConfig.dev.usersDB, [user.uid], {
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
