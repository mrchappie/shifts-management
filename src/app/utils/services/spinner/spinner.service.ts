import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _spinnerState = new BehaviorSubject<SpinnerState>(false);
  private _spinnerState$ = this._spinnerState.asObservable();
  private _spinnerStateAsValue: SpinnerState = false;

  constructor() {}

  get spinnerState(): Observable<SpinnerState> {
    return this._spinnerState$;
  }

  setSpinnerState(showSpinner: SpinnerState) {
    // if spinner is active, remove it after half a second
    if (this._spinnerStateAsValue === true) {
      setTimeout(() => {
        this._spinnerStateAsValue = showSpinner;
        return this._spinnerState.next(showSpinner);
      }, 500);
    }
    // else, if spinner is inactive, show the spinner
    else {
      this._spinnerStateAsValue = showSpinner;
      return this._spinnerState.next(showSpinner);
    }
  }
}

type SpinnerState = boolean;
