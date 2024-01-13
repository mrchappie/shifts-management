import { Injectable } from '@angular/core';

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
import { StateService } from '../state/state.service';
import { ToastService } from 'angular-toastify';
import { FirebaseConfigI, firebaseConfig } from 'firebase.config';
import { CustomFnService } from '../customFn/custom-fn.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  // DB Config
  fbConfig: FirebaseConfigI = firebaseConfig;

  constructor(
    private state: StateService,
    private firestore: Firestore,
    private customFN: CustomFnService,
    private _toastService: ToastService
  ) {}

  //! Local Storage
  setLocalStorage(key: string, data: any) {
    if (typeof data != 'string') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
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
      this.fbConfig.deploy.shiftsDB,
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
      this.setLocalStorage('currentUserShiftsThisMonth', shifts);
      return shifts;
    }
  }

  //! GET ALL SHIFTS
  async handleGetAllShifts(queryLimit: number) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    const docRef = collection(
      this.firestore,
      this.fbConfig.deploy.shiftsDB,
      ...[currentYear, currentMonth]
    );

    const q = query(docRef, limit(queryLimit));

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      this.setLocalStorage('allShiftsThisMonth', shifts);
      return shifts;
    }
  }

  //! GET SHIFTS BY SEARCH QUERY
  async handleGetShiftsBySearch(queryName: string) {
    const [currentYear, currentMonth] = this.customFN.getCurrentYearMonth();

    const docRef = collection(
      this.firestore,
      this.fbConfig.dev.shiftsDB,
      ...[currentYear, currentMonth]
    );

    const q = query(docRef, where('workplace', '==', queryName), limit(10));

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      return shifts;
    }
  }
}
