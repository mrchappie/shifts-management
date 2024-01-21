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
import { ToastService } from '../toast/toast.service';
import { firestoreConfig } from 'firebase.config';
import { CustomFnService } from '../customFn/custom-fn.service';
import { errorMessages } from '../../toastMessages';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private state: StateService,
    private firestore: Firestore,
    private toast: ToastService
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
        console.log(docSnap.data());
        return docSnap.data();
      } else {
        return [];
      }
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
    return [];
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
      this.toast.error(errorMessages.firestore);
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
      this.toast.error(errorMessages.firestore);
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
      console.log(collectionPath, documentPath);
      this.toast.error(errorMessages.firestore);
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
      this.toast.error(errorMessages.firestore);
    }
  }

  //! DELETE DOC

  async deleteFirestoreDoc(collectionName: string, documentPath: string[]) {
    try {
      await deleteDoc(doc(this.firestore, collectionName, ...documentPath));
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    }
  }

  //! GET SHIFTS
  async handleGetShiftsByUserID(userID: string, queryLimit?: number) {
    const docRef = collection(
      this.firestore,
      firestoreConfig.dev.shiftsDB.base,
      ...[firestoreConfig.dev.shiftsDB.shiftsSubColl, userID]
    );

    const q = query(docRef, limit(queryLimit as number));
    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      this.setLocalStorage('currentUserShiftsThisMonth', shifts);
      return shifts;
    }
  }

  //! GET ALL SHIFTS
  async handleGetAllShifts(userID: string, queryLimit: number) {
    const docRef = collection(
      this.firestore,
      firestoreConfig.dev.shiftsDB.base,
      ...[firestoreConfig.dev.shiftsDB.shiftsSubColl, userID]
    );

    const q = query(docRef, limit(queryLimit));

    const shifts = await this.getFirestoreDocsByQuery(q);
    console.log(shifts);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      this.setLocalStorage('allShiftsThisMonth', shifts);
      return shifts;
    }
  }

  //! GET SHIFTS BY SEARCH QUERY
  async handleGetShiftsBySearch(userID: string, queryName: string) {
    const docRef = collection(
      this.firestore,
      firestoreConfig.dev.shiftsDB.base,
      ...[firestoreConfig.dev.shiftsDB.shiftsSubColl, userID]
    );

    const q = query(docRef, where('workplace', '==', queryName), limit(10));

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      return shifts;
    }
  }
}
