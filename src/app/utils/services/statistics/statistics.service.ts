import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private _statistics = new BehaviorSubject<Statistics>({
    totalShifts: 0,
    statsPerMonth: {
      january: {
        workedHoursByShift: {
          lidl: 0,
          penny: 0,
        },
        earnedRevenueByShift: {
          lidl: 0,
          penny: 0,
        },
      },
    },
    earnedRevenueByMonth: {
      february: 0,
      january: 0,
    },
    shiftCountByMonth: {
      january: 0,
      february: 0,
    },
  });
  private _statistics$ = this._statistics.asObservable();

  constructor(private firestore: FirestoreService) {}

  get statistics(): Observable<Statistics> {
    return this._statistics$;
  }

  setStatistics(newStatistics: Statistics) {
    return this._statistics.next(newStatistics);
  }

  // handle statistics update
}

export interface Statistics {
  totalShifts: number;
  statsPerMonth: {
    january: {
      workedHoursByShift: {
        lidl: number;
        penny: number;
      };
      earnedRevenueByShift: {
        lidl: number;
        penny: number;
      };
    };
  };
  earnedRevenueByMonth: {
    february: number;
    january: number;
  };
  shiftCountByMonth: {
    january: number;
    february: number;
  };
}
