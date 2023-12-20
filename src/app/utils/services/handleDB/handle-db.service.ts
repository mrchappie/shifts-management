import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { StateService, initialState } from '../state/state.service';
import { Router } from '@angular/router';
import { RegisterFormData } from 'src/app/pages/register/register.component';
import { userProfile } from '../../userProfile';
import { State } from '../../Interfaces';
import { calculateAge } from '../../functions';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root',
})
export class HandleDBService {
  currentState!: State;

  constructor(
    private auth: Auth,
    private state: StateService,
    private firestore: Firestore,
    private _toastService: ToastService
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

      // add user information to firesote
      if (userCredential) {
        this.setFirestoreDoc('shiftAppUsers', [userCredential.user.uid], {
          firstName,
          lastName,
          email,
          dob,
          age: calculateAge(dob),
          termsAndConditions,
          id: userCredential.user.uid,
          ...userProfile,
        });

        // add user information to state
        this.state.setState({
          currentLoggedFireUser: this.getFirestoreDoc('shiftAppUsers', [
            userCredential.user.uid,
          ]),
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

      console.log(this.currentState);
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

      console.log('UserCred', userCredential);
      // add user information to state
      this.state.setState({
        currentLoggedFireUser: await this.getFirestoreDoc('shiftAppUsers', [
          userCredential.user.uid,
        ]),
        currentUserCred: userCredential,
        isLoggedIn: true,
        loggedUserID: userCredential.user.uid,
      });
      this.currentState = this.state.getState();
      console.log(this.currentState);

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

    console.log('clicked from DB service');
    return;
  }

  //! firebase getLoggedUser
  async getUserState(): Promise<User | null> {
    return new Promise(async (resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          // User is signed in
          this.state.setState({
            currentLoggedFireUser: await this.getFirestoreDoc('shiftAppUsers', [
              user.uid,
            ]),
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

      // console.log(docRef);
      const docsData = await getDocs(docRef);
      const docs: any = [];
      if (!docsData.empty) {
        docsData.forEach((doc) => {
          docs.push(doc.data());
        });

        return docs;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //! GET DOCS BY QUERY
  async getFirestoreDocsByQuery(
    collectionName: string,
    documentPath: string[],
    userID: string
  ) {
    try {
      const docRef = collection(
        this.firestore,
        collectionName,
        ...documentPath
      );

      const q = query(docRef, where('userID', '==', userID));

      console.log(docRef);
      console.log(q);

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot);
      const docs: any = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          docs.push(doc.data());
        });
        return docs;
      } else {
        throw new Error('No shifts for this user!');
      }
    } catch (error) {
      console.log(error);
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
}
