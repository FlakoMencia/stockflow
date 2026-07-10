import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { AdvancedStatisticsComponent } from './advanced-statistics.component';
import { Product } from '../../core/models/product.model';

describe('AdvancedStatisticsComponent', () => {
  let fixture: ComponentFixture<AdvancedStatisticsComponent>;
  let storeMock: any;

  beforeEach(() => {
    storeMock = createStoreMock();

    TestBed.configureTestingModule({
      imports: [AdvancedStatisticsComponent, CommonModule],
      providers: [{ provide: InventoryStore, useValue: storeMock }]
    });

    fixture = TestBed.createComponent(AdvancedStatisticsComponent);
    fixture.detectChanges();
  });

  it('should calculate the statistics from the loaded products', () => {
    const values = Array.from(fixture.nativeElement.querySelectorAll('.stat-card strong')).map(
      (element) => (element as HTMLElement).textContent?.trim() ?? ''
    );
    const wideCardDetails = (fixture.nativeElement.querySelector('.stat-card--wide small') as HTMLElement).textContent?.trim() ?? '';

    expect(values[0]).toBe('5');
    expect(values[1]).toBe('1');
    expect(values[2]).toBe('Monitor');
    expect(wideCardDetails).toContain('SKU-003');
    expect(values[3]).toMatch(/2[, ]?150/);
  });

  it('should handle an empty product list', () => {
    storeMock.products.set([]);
    fixture.detectChanges();

    const values = Array.from(fixture.nativeElement.querySelectorAll('.stat-card strong')).map(
      (element) => (element as HTMLElement).textContent?.trim() ?? ''
    );

    expect(values[0]).toBe('0');
    expect(values[1]).toBe('0');
    expect(values[2]).toBe('Sin datos suficientes');
    expect(values[3]).toContain('0');
  });
});

function createStoreMock(): any {
  const store: any = {};
  store.products = signal<Product[]>([
    buildProduct(1, 'SKU-001', 'Laptop', 8, 3, 100),
    buildProduct(2, 'SKU-002', 'Chair', 2, 3, 50),
    buildProduct(3, 'SKU-003', 'Monitor', 5, 1, 250)
  ]);
  store.totalInventoryValue = computed(() =>
    store.products().reduce((total: number, product: Product) => total + product.currentStock * product.unitPrice, 0)
  );

  return store;
}

function buildProduct(
  id: number,
  sku: string,
  name: string,
  currentStock: number,
  minimumStock: number,
  unitPrice: number
): Product {
  return {
    id,
    sku,
    name,
    description: null,
    category: 'Electronics',
    currentStock,
    minimumStock,
    unitPrice,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };
}
