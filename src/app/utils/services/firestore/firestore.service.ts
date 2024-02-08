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
import { errorMessages } from '../../toastMessages';
import { InlineSpinnerService } from '../spinner/inline-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private state: StateService,
    private firestore: Firestore,
    private toast: ToastService,
    private inlineSpinner: InlineSpinnerService
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
        // console.log(docSnap.data());
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
      this.inlineSpinner.setSpinnerState(true);

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
    } finally {
      this.inlineSpinner.setSpinnerState(false);
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
      // console.log(error);
      this.toast.error(errorMessages.firestore);
    }
  }

  //! CHECK ADMIN DOC
  async checkFirestoreAdminDoc(
    collectionPath: string,
    documentPath: string[],
    data: object
  ) {
    try {
      const querySnapshot = await getDoc(
        doc(collection(this.firestore, collectionPath), ...documentPath)
      );

      if (!querySnapshot.exists()) {
        this.setFirestoreDoc(collectionPath, documentPath, data);
      }
    } catch (error) {
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
      // console.log(error);
      this.toast.error(errorMessages.firestore);
    }
  }

  //! DELETE DOC

  async deleteFirestoreDoc(collectionName: string, documentPath: string[]) {
    try {
      await deleteDoc(doc(this.firestore, collectionName, ...documentPath));
    } catch (error) {
      // console.log(error);
      this.toast.error(errorMessages.firestore);
    }
  }

  //! GET SHIFTS
  async handleGetShiftsByUserID(
    userID: string,
    queryLimit?: number,
    shiftsDateStart?: number,
    shiftsDateEnd?: number
  ) {
    const docRef = collection(
      this.firestore,
      firestoreConfig.firestore.shiftsDB.base,
      ...[firestoreConfig.firestore.shiftsDB.shifts, userID]
    );

    // create the query based on what user inputs
    let q;
    if (shiftsDateStart && shiftsDateEnd) {
      q = query(
        docRef,
        limit(queryLimit as number),
        where('shiftDate', '>=', shiftsDateStart),
        where('shiftDate', '<=', shiftsDateEnd)
      );
    } else {
      q = query(docRef, limit(queryLimit as number));
    }
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
      firestoreConfig.firestore.shiftsDB.base,
      ...[firestoreConfig.firestore.shiftsDB.shifts, userID]
    );

    const q = query(docRef, limit(queryLimit));

    const shifts = await this.getFirestoreDocsByQuery(q);
    // console.log(shifts);

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
      firestoreConfig.firestore.shiftsDB.base,
      ...[firestoreConfig.firestore.shiftsDB.shifts, userID]
    );

    const q = query(docRef, where('workplace', '==', queryName), limit(10));

    const shifts = await this.getFirestoreDocsByQuery(q);

    if (shifts) {
      this.state.setState({ shifts: shifts });
      return shifts;
    }
  }

  //! GET SHIFTS BY WEEK
  async handleGetShiftsByWeek(
    userID: string,
    startDate: number,
    endDate: number
  ) {
    try {
      this.inlineSpinner.setSpinnerState(true);

      const docRef = collection(
        this.firestore,
        firestoreConfig.firestore.shiftsDB.base,
        ...[firestoreConfig.firestore.shiftsDB.shifts, userID]
      );

      const q = query(
        docRef,
        where('shiftDate', '>=', startDate),
        where('shiftDate', '<=', endDate)
      );

      const shifts = await this.getFirestoreDocsByQuery(q);

      if (shifts) {
        this.state.setState({ shifts: shifts });
        return shifts;
      }
    } catch (error) {
      this.toast.error(errorMessages.firestore);
    } finally {
      this.inlineSpinner.setSpinnerState(false);
    }
  }
}
