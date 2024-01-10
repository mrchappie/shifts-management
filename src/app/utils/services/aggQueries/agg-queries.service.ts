import { Injectable } from '@angular/core';
import {
  collection,
  where,
  getAggregateFromServer,
  sum,
  average,
  getCountFromServer,
  Firestore,
  query,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AggQueriesService {
  constructor(private firestore: Firestore) {}

  //! SUM
  async getFirebaseSum(queryOptions: { [key: string]: any }) {
    try {
      const {
        month,
        year,
        collectionName,
        collectionPath,
        queryName,
        queryValue,
        itemToQuery,
      } = queryOptions;

      const coll = collection(
        this.firestore,
        collectionName,
        ...collectionPath
      );
      // fetch with query if query data exists
      if ((queryName || queryName != '') && (queryValue || queryValue != '')) {
        const q = query(coll, where(queryName, '==', queryValue));
        const snapshot = await getAggregateFromServer(q, {
          sum: sum(itemToQuery),
        });

        if (snapshot.data().sum) {
          return snapshot.data().sum;
        } else {
          return 0;
        }
        // fetch without query if query data do not exists
      } else {
        const snapshot = await getAggregateFromServer(coll, {
          sum: sum(itemToQuery),
        });

        if (snapshot.data().sum) {
          return snapshot.data().sum;
        } else {
          return 0;
        }
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  //! AVERAGE
  async getFirebaseAverage(queryOptions: { [key: string]: any }) {
    const {
      month,
      year,
      collectionName,
      collectionPath,
      queryName,
      queryValue,
      itemToQuery,
    } = queryOptions;

    const coll = collection(this.firestore, collectionName, ...collectionPath);
    const q = query(coll, where(queryName, '==', queryValue));
    const snapshot = await getAggregateFromServer(q, {
      average: average(itemToQuery),
    });

    if (snapshot.data().average) {
      return snapshot.data().average;
    } else {
      return 0;
    }
  }

  //! COUNT
  async getFirebaseCount(queryOptions: { [key: string]: any }) {
    const {
      month,
      year,
      collectionName,
      collectionPath,
      queryName,
      queryValue,
      itemToQuery,
    } = queryOptions;

    const coll = collection(this.firestore, collectionName, ...collectionPath);
    // fetch with query if query data exists
    if ((queryName || queryName != '') && (queryValue || queryValue != '')) {
      const q = query(coll, where(queryName, '==', queryValue));
      const snapshot = await getCountFromServer(q);

      if (snapshot.data().count) {
        return snapshot.data().count;
      } else {
        return 0;
      }
      // fetch without query if query data do not exists
    } else {
      const snapshot = await getCountFromServer(coll);

      if (snapshot.data().count) {
        return snapshot.data().count;
      } else {
        return 0;
      }
    }
  }
}
