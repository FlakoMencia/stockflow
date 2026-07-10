import { HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AlertApiService } from '../api/alert-api.service';
import { ProductApiService } from '../api/product-api.service';
import { AlertSeverity } from '../models/alert-severity.enum';
import { ErrorResponse } from '../models/error-response.model';
import { PageResponse } from '../models/page-response.model';
import { Product } from '../models/product.model';
import { StockAlert } from '../models/stock-alert.model';
import { ToastService } from '../services/toast.service';

const SERVICE_UNAVAILABLE_MESSAGE = 'Inventory service is currently unavailable. Please try again later.';

@Injectable({
  providedIn: 'root'
})
export class InventoryStore {
  private readonly productApi = inject(ProductApiService);
  private readonly alertApi = inject(AlertApiService);
  private readonly toastService = inject(ToastService);
  private readonly categoryFilterStorageKey = 'stockflow.inventory.categoryFilter';
  private alertsEffectInitialized = false;
  private lastAlertToastCount: number | null = null;

  readonly products = signal<Product[]>([]);
  readonly productsPage = signal<PageResponse<Product> | null>(null);
  readonly activeAlerts = signal<StockAlert[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly activeError = signal<ErrorResponse | null>(null);
  readonly activeCategoryFilter = signal<string | null>(this.readStoredCategoryFilter());

  readonly totalProductsCount = computed(() => this.products().length);

  readonly criticalAlertsCount = computed(
    () => this.activeAlerts().filter((alert) => alert.severity === AlertSeverity.CRITICAL).length
  );

  readonly totalInventoryValue = computed(() =>
    this.products().reduce((total, product) => total + product.currentStock * product.unitPrice, 0)
  );

  constructor() {
    effect(() => {
      const category = this.activeCategoryFilter();

      if (typeof localStorage === 'undefined') {
        return;
      }

      if (category === null) {
        localStorage.removeItem(this.categoryFilterStorageKey);
        return;
      }

      localStorage.setItem(this.categoryFilterStorageKey, category);
    });

    effect(
        () => {
          const alerts = this.activeAlerts();
          const currentCount = alerts.length;

          if (!this.alertsEffectInitialized) {
            this.alertsEffectInitialized = true;
            this.lastAlertToastCount = currentCount;
            return;
          }

          if (currentCount === 0) {
            this.lastAlertToastCount = 0;
            return;
          }

          if (this.lastAlertToastCount === currentCount) {
            return;
          }

          this.lastAlertToastCount = currentCount;

          this.toastService.warning(
              `Tienes ${currentCount} alertas activas de inventario.`
          );
        },
        { allowSignalWrites: true }
    );
  }

  loadProducts(page = 0, size = 10, category?: string): void {
    const resolvedCategory = this.normalizeCategory(category ?? this.activeCategoryFilter());

    if (category !== undefined) {
      this.activeCategoryFilter.set(resolvedCategory);
    }

    this.loading.set(true);
    this.activeError.set(null);

    this.productApi
      .getProducts(page, size, resolvedCategory ?? undefined)
      .pipe(
        catchError((error: unknown) => {
          this.activeError.set(this.toErrorResponse(error, '/api/v1/products'));
          return EMPTY;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((response) => {
        this.productsPage.set(response);
        this.products.set(response.content);
      });
  }

  loadAlerts(): void {
    this.loading.set(true);
    this.activeError.set(null);

    this.alertApi
      .getAlerts()
      .pipe(
        catchError((error: unknown) => {
          this.activeError.set(this.toErrorResponse(error, '/api/v1/alerts'));
          return EMPTY;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((alerts) => {
        this.activeAlerts.set(alerts);
      });
  }

  selectProduct(productId: number): void {
    const existingProduct = this.products().find((product) => product.id === productId);

    if (existingProduct) {
      this.activeError.set(null);
      this.selectedProduct.set(existingProduct);
      return;
    }

    this.loading.set(true);
    this.activeError.set(null);

    this.productApi
      .getProductById(productId)
      .pipe(
        catchError((error: unknown) => {
          this.activeError.set(this.toErrorResponse(error, `/api/v1/products/${productId}`));
          return EMPTY;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((product) => {
        this.selectedProduct.set(product);
      });
  }

  clearSelectedProduct(): void {
    this.selectedProduct.set(null);
  }

  setCategoryFilter(category: string | null): void {
    this.activeCategoryFilter.set(this.normalizeCategory(category));
  }

  clearError(): void {
    this.activeError.set(null);
  }

  private readStoredCategoryFilter(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return this.normalizeCategory(localStorage.getItem(this.categoryFilterStorageKey));
  }

  private normalizeCategory(category: string | null | undefined): string | null {
    const normalizedCategory = category?.trim();
    return normalizedCategory ? normalizedCategory : null;
  }

  private toErrorResponse(error: unknown, path: string): ErrorResponse {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return {
          timestamp: new Date().toISOString(),
          status: 503,
          error: 'Service Unavailable',
          message: SERVICE_UNAVAILABLE_MESSAGE,
          path
        };
      }

      const message =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message ?? error.message ?? 'Unexpected error';

      return {
        timestamp: new Date().toISOString(),
        status: error.status || 500,
        error: error.statusText || 'Error',
        message,
        path
      };
    }

    return {
      timestamp: new Date().toISOString(),
      status: 500,
      error: 'Error',
      message: error instanceof Error ? error.message : 'Unexpected error',
      path
    };
  }
}
