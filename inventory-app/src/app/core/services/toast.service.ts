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
  private static readonly DURATIONS: Record<ToastType, number> = {
    success: 8000,
    info: 8000,
    error: 20000,
    warning: 20000
  };

  private nextId = 1;
  private readonly _toasts = signal<Toast[]>([]);
  private readonly dismissTimers = new Map<number, ReturnType<typeof setTimeout>>();

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
    this.clearDismissTimer(id);
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private addToast(type: ToastType, message: string): number {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);
    this.scheduleDismiss(id, type);
    return id;
  }

  private scheduleDismiss(id: number, type: ToastType): void {
    this.clearDismissTimer(id);

    const timer = setTimeout(() => {
      this.dismissTimers.delete(id);
      this.dismiss(id);
    }, ToastService.DURATIONS[type]);

    this.dismissTimers.set(id, timer);
  }

  private clearDismissTimer(id: number): void {
    const timer = this.dismissTimers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      this.dismissTimers.delete(id);
    }
  }
}
