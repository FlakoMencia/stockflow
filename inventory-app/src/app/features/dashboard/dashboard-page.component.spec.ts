import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { AlertSeverity } from '../../core/models/alert-severity.enum';
import { ErrorResponse } from '../../core/models/error-response.model';
import { Product } from '../../core/models/product.model';
import { StockAlert } from '../../core/models/stock-alert.model';
import { InventoryStore } from '../../core/store/inventory.store';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  let fixture: ComponentFixture<DashboardPageComponent>;
  let storeMock: any;

  beforeEach(() => {
    storeMock = createStoreMock();

    TestBed.configureTestingModule({
      imports: [DashboardPageComponent, CommonModule],
      providers: [{ provide: InventoryStore, useValue: storeMock }]
    });

    fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();
  });

  it('should render KPI values from InventoryStore', () => {
    const kpiValues = getKpiValues();

    expect(kpiValues.length).toBe(4);
    expect(kpiValues[0]).toBe('2');
    expect(kpiValues[1]).toBe('2');
    expect(kpiValues[2]).toBe('1');
    expect(kpiValues[3]).toMatch(/10[.,]250/);
  });

  it('should show loading state', () => {
    storeMock.loading.set(true);
    fixture.detectChanges();

    const loadingState = fixture.nativeElement.querySelector('.state--loading') as HTMLElement;

    expect(loadingState.textContent?.trim()).toContain('Cargando inventory');
  });

  it('should show error state', () => {
    storeMock.activeError.set({
      timestamp: '2024-01-01T00:00:00.000Z',
      status: 503,
      error: 'Service Unavailable',
      message: 'Backend is down',
      path: '/api/v1/products'
    });
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('.state--error') as HTMLElement;

    expect(errorState.textContent).toContain('Service Unavailable');
    expect(errorState.textContent).toContain('Backend is down');
  });

  function getKpiValues(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.kpi-card strong')).map((element) =>
      (element as HTMLElement).textContent?.trim() ?? ''
    );
  }
});

function createStoreMock(): any {
  const store: any = {};
  store.products = signal<Product[]>([
    {
      id: 1,
      sku: 'SKU-001',
      name: 'Laptop',
      description: null,
      category: 'Electronics',
      currentStock: 10,
      minimumStock: 3,
      unitPrice: 1000,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      sku: 'SKU-002',
      name: 'Chair',
      description: null,
      category: 'Furniture',
      currentStock: 5,
      minimumStock: 2,
      unitPrice: 50,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]);
  store.activeAlerts = signal<StockAlert[]>([
    {
      productId: 1,
      productSku: 'SKU-001',
      productName: 'Laptop',
      currentStock: 0,
      minimumStock: 3,
      severity: AlertSeverity.CRITICAL,
      generatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      productId: 2,
      productSku: 'SKU-002',
      productName: 'Chair',
      currentStock: 2,
      minimumStock: 2,
      severity: AlertSeverity.LOW,
      generatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]);
  store.loading = signal(false);
  store.activeError = signal<ErrorResponse | null>(null);
  store.activeCategoryFilter = signal<string | null>('Electronics');
  store.totalProductsCount = computed(() => store.products().length);
  store.criticalAlertsCount = computed(() =>
    store.activeAlerts().filter((alert: StockAlert) => alert.severity === AlertSeverity.CRITICAL).length
  );
  store.totalInventoryValue = computed(() =>
    store.products().reduce((total: number, product: Product) => total + product.currentStock * product.unitPrice, 0)
  );
  store.loadProducts = jasmine.createSpy('loadProducts');
  store.loadAlerts = jasmine.createSpy('loadAlerts');

  return store;
}
