import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoading(loading: boolean) {
    console.log(loading);
    this.loadingSubject.next(loading);
  }

  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
