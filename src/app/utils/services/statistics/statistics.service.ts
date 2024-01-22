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

  async updateStatistics() {
    const stats = await this.firestore.getFirestoreDoc(
      firestoreConfig.dev.statistics.base,
      [
        firestoreConfig.dev.statistics.users,
        'LYuxAYp42lg1HUeofYC4mHRfd7q2',
        '2024',
      ]
    );
    this.setStatistics(stats as Statistics);
    console.log('update');
  }

  // handle statistics update

  updateUserStatistics(
    path: string[],
    newValue: number,
    action: string,
    type: string,
    userID?: string
  ) {
    this.updateStatistics().then(() => {
      //? if a shift or a value is added, update the correct statistic
      if (action === 'add') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'shift') {
            return newValue + this.statisticsAsValue.shiftCountByMonth[path[1]];
          } else {
            return (
              newValue + this.statisticsAsValue.earnedRevenueByMonth[path[1]]
            );
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the statistic
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [
            firestoreConfig.dev.statistics.users,
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            '2024',
          ],
          updateObject
        );
      }
      //? if a shift or a value is updated, update the correct statistic
      if (action === 'update') {
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [
            firestoreConfig.dev.statistics.users,
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            '2024',
          ],
          { 'statsPerMonth.workedHoursByShift.january.lidl': 10 }
        );
      }
      //? if a shift or a value is deleted, update the correct statistic
      if (action === 'subtract') {
        // create path
        const dbPath: string = path?.join('.');
        // calculate new value ( add the new value to the existing one )
        const getNewValue = () => {
          if (type === 'shift') {
            return this.statisticsAsValue.shiftCountByMonth[path[1]] - newValue;
          } else {
            return (
              this.statisticsAsValue.earnedRevenueByMonth[path[1]] - newValue
            );
          }
        };
        // temporary object
        const updateObject: { [key: string]: number } = {};
        updateObject[dbPath] = getNewValue();

        // update the statistic
        this.firestore.updateFirestoreDoc(
          firestoreConfig.dev.statistics.base,
          [
            firestoreConfig.dev.statistics.users,
            'LYuxAYp42lg1HUeofYC4mHRfd7q2',
            '2024',
          ],
          updateObject
        );
      }
    });
  }

  updateAdminStatistics() {}
}
