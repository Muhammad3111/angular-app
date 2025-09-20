import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastState {
  type: ToastType;
  message: string;
  ttl: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSignal = signal<ToastState | null>(null);
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = this.toastSignal.asReadonly();

  show(type: ToastType, message: string, ttl = 2500) {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.toastSignal.set({ type, message, ttl });

    this.hideTimer = setTimeout(() => this.clear(), ttl);
  }

  clear() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.toastSignal.set(null);
  }
}
