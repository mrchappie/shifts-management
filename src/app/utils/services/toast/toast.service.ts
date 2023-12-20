import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  success(message: string, element: HTMLElement) {}

  warning(message: string, element: HTMLElement) {}

  error(message: string, element: HTMLElement) {}
}
