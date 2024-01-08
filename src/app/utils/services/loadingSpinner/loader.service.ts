import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from '../state/state.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private state: StateService) {}

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
    this.state.setState({ isLoading: true });
  }

  get loading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
