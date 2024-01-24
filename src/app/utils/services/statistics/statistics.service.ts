import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { Statistics, defaultStatsObject } from './defaultStatsObject';
import { firestoreConfig } from 'firebase.config';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private _statistics = new BehaviorSubject<Statistics>(defaultStatsObject);
  private _statistics$ = this._statistics.asObservable();
  private statisticsAsValue!: Statistics;

  //prettier-ignore
  private months: string[] = [
    "january","february","march","april","may","june","july",
    "august", "september", "october", "november", "december"
  ];

  constructor(private firestore: FirestoreService) {}

  get statistics(): Observable<Statistics> {
    return this._statistics$;
  }

  setStatistics(newStatistics: Statistics) {
    this.statisticsAsValue = newStatistics;
    return this._statistics.next(newStatistics);
  }

  async getStatisticsFromDB(documentPath: string[]) {
    await this.firestore
      .getFirestoreDoc(firestoreConfig.dev.statistics.base, documentPath)
      .then((data) => {
        this.setStatistics(data as Statistics);
        console.log('update');
      });
  }

  // handle statistics update

  updateUserStatistics(
    path: string[],
    value: number,
    action: string,
    type: string,
    userID: string
  ) {
    this.getStatisticsFromDB([
      firestoreConfig.dev.statistics.users,
      userID,
      '2024',
    ]).then(() => {
      //?
      //? if a shift or a value is added, update the correct statistic
      if (action === 'add') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'totalShifts') {
            // save the existing value into a variable
            const existingValue = this.statisticsAsValue.totalShifts;
            // before addition, it checks that the existing value is truthy
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'shift') {
            // save the existing value into a variable
            const existingValue =
              this.statisticsAsValue.shiftCountByMonth[path[1]];
            // before addition, it checks that the existing value is truthy
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'revenue') {
            const existingValue =
              this.statisticsAsValue.earnedRevenueByMonth[path[1]];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'earnedRevenue') {
            const existingValue =
              this.statisticsAsValue.statsPerMonth.earnedRevenueByShift[
                path[2]
              ][path[3]];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else {
            const existingValue =
              this.statisticsAsValue.statsPerMonth.workedHoursByShift[path[2]][
                path[3]
              ];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [firestoreConfig.dev.statistics.users, userID, '2024'],
          updateObject
        );
        // update statistics for admin dashboard
        this.updateAdminStatistics(path, value, action, type);
      }
      //?
      //? if a shift or a value is deleted, update the correct statistic
      if (action === 'subtract') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'shift') {
            return this.statisticsAsValue.shiftCountByMonth[path[1]] - value;
          } else if (type === 'revenue') {
            return this.statisticsAsValue.earnedRevenueByMonth[path[1]] - value;
          } else {
            return this.statisticsAsValue.totalShifts - value;
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [firestoreConfig.dev.statistics.users, userID, '2024'],
          updateObject
        );
        // update statistics for admin dashboard
        this.updateAdminStatistics(path, value, action, type);
      }
    });
  }

  updateAdminStatistics(
    path: string[],
    value: number,
    action: string,
    type: string
  ) {
    // update the admin statistic
    this.getStatisticsFromDB([
      firestoreConfig.dev.statistics.admin,
      'year',
      '2024',
    ]).then(() => {
      //?
      //? if a shift or a value is added, update the correct statistic
      if (action === 'add') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'totalShifts') {
            // save the existing value into a variable
            const existingValue = this.statisticsAsValue.totalShifts;
            // before addition, it checks that the existing value is truthy
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'shift') {
            // save the existing value into a variable
            const existingValue =
              this.statisticsAsValue.shiftCountByMonth[path[1]];
            // before addition, it checks that the existing value is truthy
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'revenue') {
            const existingValue =
              this.statisticsAsValue.earnedRevenueByMonth[path[1]];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else if (type === 'earnedRevenue') {
            const existingValue =
              this.statisticsAsValue.statsPerMonth.earnedRevenueByShift[
                path[2]
              ][path[3]];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          } else {
            const existingValue =
              this.statisticsAsValue.statsPerMonth.workedHoursByShift[path[2]][
                path[3]
              ];
            return value + (!isNaN(existingValue) ? existingValue : 0);
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [firestoreConfig.dev.statistics.admin, 'year', '2024'],
          updateObject
        );
      }
      //?
      //? if a shift or a value is deleted, update the correct statistic
      if (action === 'subtract') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'shift') {
            return this.statisticsAsValue.shiftCountByMonth[path[1]] - value;
          } else if (type === 'revenue') {
            return this.statisticsAsValue.earnedRevenueByMonth[path[1]] - value;
          } else {
            return this.statisticsAsValue.totalShifts - value;
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [firestoreConfig.dev.statistics.admin, 'year', '2024'],
          updateObject
        );
      }
    });
  }
}
