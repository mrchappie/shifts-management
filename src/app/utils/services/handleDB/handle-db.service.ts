import { Injectable } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from '@angular/fire/auth';

import {
  Firestore,
  Query,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { StateService, initialState } from '../state/state.service';
import { RegisterFormData } from 'src/app/pages/register/register.component';
import { userProfile } from '../../userProfile';
import { State } from '../../Interfaces';
import { calculateAge } from '../../functions';
import { ToastService } from 'angular-toastify';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { CustomFnService } from '../customFn/custom-fn.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HandleDBService {
  currentState!: State;

  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  constructor(
    private auth: Auth,
    private state: StateService,
    private firestore: Firestore,
    private _toastService: ToastService,
    private customFN: CustomFnService,
    private router: Router
  ) {
    this.currentState = this.state.getState();
  }

  // localStorage
  setLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  //! AUTH
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
        this.setFirestoreDoc(
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
          currentLoggedFireUser: this.getFirestoreDoc(
            this.fbConfig.dev.usersDB,
            [userCredential.user.uid]
          ),
          currentUserCred: userCredential,
          isLoggedIn: true,
          loggedUserID: userCredential.user.uid,
        });
        this.currentState = this.state.getState();

        // add user information to localStorage
        this.setLocalStorage(
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
        currentLoggedFireUser: await this.getFirestoreDoc(
          this.fbConfig.dev.usersDB,
          [userCredential.user.uid]
        ),
        currentUserCred: userCredential,
        isLoggedIn: true,
        loggedUserID: userCredential.user.uid,
      });
      this.currentState = this.state.getState();

      // add user information to localStorage
      this.setLocalStorage(
        'currentLoggedFireUser',
        this.currentState.currentLoggedFireUser
      );

      this._toastService.success('Login successfully!');
      return userCredential;
    } catch (error) {
      this._toastService.error('Error on login!');
    }
    return null;
  }

  //! LOGOUT
  async logout() {
    await signOut(this.auth);
    this.state.setState(initialState);
    this.removeLocalStorage('currentLoggedFireUser');
    this.removeLocalStorage('loggedUserShifts');

    this.router.navigate(['/login']);

    return;
  }

  //! RESET PASSWORD
  async setUserPassword(email: string, oldPass: string, newPass: string) {
    try {
      const user = this.auth.currentUser as User;
      const credentials = EmailAuthProvider.credential(email, oldPass);
      await reauthenticateWithCredential(user, credentials);

      await updatePassword(user, newPass);
      this.logout();
    } catch (error) {
      console.log(error);
    }
  }

  //! NEW EMAIL
  async setUserEmail(oldEmail: string, newEmail: string, password: string) {
    try {
      const user = this.auth.currentUser as User;
      await sendEmailVerification(user);

      const credentials = EmailAuthProvider.credential(oldEmail, password);
      await reauthenticateWithCredential(user, credentials);
      await updateEmail(user, newEmail);

      this.logout();
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

  //! DELETE USER

  //! firebase getLoggedUser
  async getUserState(): Promise<User | null> {
    return new Promise(async (resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in
          this.state.setState({
            currentLoggedFireUser: await this.getFirestoreDoc(
              this.fbConfig.dev.usersDB,
              [user.uid]
            ),
            emailVerified: user.emailVerified,
            currentUserCred: user,
            isLoggedIn: true,
          });
          resolve(user);
        } else {
          // User is signed out
          resolve(null);
        }
        unsubscribe(); // unsubscribe after the first change
      });
    });
  }

  //! GET DOC
  async getFirestoreDoc(collectionName: string, documentPath: string[]) {
    try {
      const docRef = doc(this.firestore, collectionName, ...documentPath);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  //! GET DOCS
  async getFirestoreDocs(collectionName: string, documentPath: string[]) {
    try {
      const docRef = collection(
        this.firestore,
        collectionName,
        ...documentPath
      );

      const docsData = await getDocs(docRef);
      const docs: any = [];

      if (!docsData.empty) {
        docsData.forEach((doc) => {
          docs.push(doc.data());
        });

        return docs;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  //! GET DOCS BY QUERY
  async getFirestoreDocsByQuery(q: Query) {
    try {
      // const docRef = collection(
      //   this.firestore,
      //   collectionName,
      //   ...documentPath
      // );

      // const q = query(docRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const docs: any = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          docs.push(doc.data());
        });
        return docs;
      } else {
        return [];
      }
    } catch (error) {
      this._toastService.error(`${error}`);
    }
  }

  //! SET DOC
  async setFirestoreDoc(
    collectionPath: string,
    documentPath: string[],
    data: object
  ) {
    try {
      const docRef = doc(
        collection(this.firestore, collectionPath),
        ...documentPath
      );
      await setDoc(docRef, data);
    } catch (error) {
      console.log(error);
    }
  }

  //! UPDATE DOC

  async updateFirestoreDoc(
    collectionPath: string,
    documentPath: string[],
    data: object
  ) {
    try {
      const docRef = doc(
        collection(this.firestore, collectionPath),
        ...documentPath
      );
      await updateDoc(docRef, data);
    } catch (error) {
      console.log(error);
    }
  }

  //! DELETE DOC

  async deleteFirestoreDoc(collectionName: string, documentPath: string[]) {
    try {
      await deleteDoc(doc(this.firestore, collectionName, ...documentPath));
    } catch (error) {
      console.log(error);
    }
  }

  //! GET SHIFTS
  async handleGetShiftsByUserID(userID: string, queryLimit?: number) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    const docRef = collection(
      this.firestore,
      this.fbConfig.dev.shiftsDB,
      ...[currentYear, currentMonth]
    );

    const q = query(
      docRef,
      where('userID', '==', userID),
      limit(queryLimit as number)
    );

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      this.setLocalStorage('loggedUserShifts', shifts);
    }

    return shifts;
  }

  //! GET ALL SHIFTS
  async handleGetAllShifts(queryLimit: number) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    const docRef = collection(
      this.firestore,
      this.fbConfig.dev.shiftsDB,
      ...[currentYear, currentMonth]
    );

    const q = query(docRef, limit(queryLimit));

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      this.setLocalStorage('loggedUserShifts', shifts);
    }

    return shifts;
  }
}
