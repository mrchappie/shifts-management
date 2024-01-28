import { Injectable } from '@angular/core';
import { StateService } from '../state/state.service';
import { FirestoreService } from '../firestore/firestore.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shift } from '../../Interfaces';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  private shiftsList = new BehaviorSubject<Shift[]>([]);
  private shifts$ = this.shiftsList.asObservable();

  constructor(
    private state: StateService,
    private firestore: FirestoreService
  ) {}

  get shifts(): Observable<Shift[]> {
    return this.shifts$;
  }

  setShifts(data: Shift[]) {
    return this.shiftsList.next(data);
  }

  //? Set shifts

  //? Get shifts
  // default function to load shifts
  async getShiftsByUserID(
    userID: string,
    limit: number,
    queryDateStart?: number,
    queryDateEnd?: number
  ) {
    const data = await this.firestore.handleGetShiftsByUserID(
      userID,
      limit,
      queryDateStart,
      queryDateEnd
    );
    this.setShifts(data);
  }

  // default function to load shifts
  async getAllShifts(userID: string, limit: number) {
    const data = await this.firestore.handleGetAllShifts(userID, limit);
    this.setShifts(data);
  }

  // get shifts by searched workplace
  async getShiftsByWorkplace(userID: string, workplace: string) {
    const data = await this.firestore.handleGetShiftsBySearch(
      userID,
      workplace.toLowerCase()
    );
    this.setShifts(data);
  }

  // get shifts by multiple searched queries like month and year, start date and end date, limit
  async getShiftsByMultipleQueries(
    userID: string,
    limit: number,
    queryDateStart?: number,
    queryDateEnd?: number
  ) {
    const data = await this.firestore.handleGetShiftsByUserID(
      userID,
      limit,
      queryDateStart,
      queryDateEnd
    );
    this.setShifts(data);
  }
}
