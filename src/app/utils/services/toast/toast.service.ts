import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  constructor() {}

  // toast types
  success(message: string, delay: number = 4000) {
    this.show({ type: 'success', message: message, delay: delay });
  }
  warning(message: string, delay: number = 4000) {
    this.show({ type: 'warning', message: message, delay: delay });
  }
  error(message: string, delay: number = 4000) {
    this.show({ type: 'error', message: message, delay: delay });
  }
  info(message: string, delay: number = 4000) {
    this.show({ type: 'info', message: message, delay: delay });
  }

  // show toast
  show(toast: Toast) {
    this.toasts.push(toast);
    setTimeout(() => {
      this.remove(this.toasts.indexOf(toast));
    }, toast.delay);
  }

  // remove toast
  remove(index: number) {
    this.toasts.splice(index, 1);
  }

  // getter for toasts list
  get toastsList() {
    return this.toasts;
  }
}

interface Toast {
  type: string;
  message: string;
  delay: number;
}
