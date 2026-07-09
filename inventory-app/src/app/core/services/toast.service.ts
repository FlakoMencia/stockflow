import { Injectable, computed, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 1;
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = computed(() => this._toasts());

  success(message: string): number {
    return this.addToast('success', message);
  }

  error(message: string): number {
    return this.addToast('error', message);
  }

  warning(message: string): number {
    return this.addToast('warning', message);
  }

  info(message: string): number {
    return this.addToast('info', message);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private addToast(type: ToastType, message: string): number {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);
    return id;
  }
}
