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
      .getFirestoreDoc(firestoreConfig.firestore.statistics.base, documentPath)
      .then((data) => {
        if (Array.isArray(data) && data.length === 0) {
          // Execute code when there is no stats for the user
          // Init the stats for this user in DB
          this.firestore.setFirestoreDoc(
            firestoreConfig.firestore.statistics.base,
            documentPath,
            defaultStatsObject
          );

          // check if the admin has the desired path
          this.firestore.checkFirestoreAdminDoc(
            firestoreConfig.firestore.statistics.base,
            [
              firestoreConfig.firestore.statistics.admin,
              'year',
              documentPath[1],
            ],
            defaultStatsObject
          );
          // return default stats to be displayed
          this.setStatistics(defaultStatsObject as Statistics);
        } else {
          // Process the data when stats are present in DB
          this.setStatistics(data as Statistics);
        }
      });
  }

  // handle statistics update

  updateUserStatistics(
    path: string[],
    value: number,
    action: string,
    type: string,
    userID: string,
    year?: string
  ) {
    this.getStatisticsFromDB([
      firestoreConfig.firestore.statistics.users,
      year as string,
      userID,
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
          firestoreConfig.firestore.statistics.base,
          [firestoreConfig.firestore.statistics.users, year as string, userID],
          updateObject
        );
        // update statistics for admin dashboard
        this.updateAdminStatistics(path, value, action, type, year as string);
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
          } else if (type === 'totalShifts') {
            return this.statisticsAsValue.totalShifts - value;
          } else if (type === 'earnedRevenue') {
            return (
              this.statisticsAsValue.statsPerMonth.earnedRevenueByShift[
                path[2]
              ][path[3]] - value
            );
          } else {
            return (
              this.statisticsAsValue.statsPerMonth.workedHoursByShift[path[2]][
                path[3]
              ] - value
            );
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.firestore.statistics.base,
          [firestoreConfig.firestore.statistics.users, year as string, userID],
          updateObject
        );
        // update statistics for admin dashboard
        this.updateAdminStatistics(path, value, action, type, year as string);
      }
    });
  }

  updateAdminStatistics(
    path: string[],
    value: number,
    action: string,
    type: string,
    year: string
  ) {
    // update the admin statistic
    this.getStatisticsFromDB([
      firestoreConfig.firestore.statistics.admin,
      'year',
      year,
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
          } else if (type === 'totalUsers') {
            // save the existing value into a variable
            const existingValue = this.statisticsAsValue.totalUsers;
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
          firestoreConfig.firestore.statistics.base,
          [firestoreConfig.firestore.statistics.admin, 'year', year],
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
          } else if (type === 'totalShifts') {
            return this.statisticsAsValue.totalShifts - value;
          } else if (type === 'earnedRevenue') {
            return (
              this.statisticsAsValue.statsPerMonth.earnedRevenueByShift[
                path[2]
              ][path[3]] - value
            );
          } else {
            return (
              this.statisticsAsValue.statsPerMonth.workedHoursByShift[path[2]][
                path[3]
              ] - value
            );
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the user statistics
        this.firestore.updateFirestoreDoc(
          firestoreConfig.firestore.statistics.base,
          [firestoreConfig.firestore.statistics.admin, 'year', year],
          updateObject
        );
      }
    });
  }
}
