import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { ErrorResponse } from '../../core/models/error-response.model';
import { PageResponse } from '../../core/models/page-response.model';
import { Product } from '../../core/models/product.model';
import { InventoryStore } from '../../core/store/inventory.store';
import { ProductsPageComponent } from './products-page.component';

describe('ProductsPageComponent', () => {
  let fixture: ComponentFixture<ProductsPageComponent>;
  let component: ProductsPageComponent;
  let storeMock: any;

  beforeEach(() => {
    storeMock = createStoreMock();

    TestBed.configureTestingModule({
      imports: [ProductsPageComponent, CommonModule],
      providers: [{ provide: InventoryStore, useValue: storeMock }]
    });

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storeMock.loadProducts.calls.reset();
    storeMock.setCategoryFilter.calls.reset();
    storeMock.selectProduct.calls.reset();
  });

  it('should render products', () => {
    const rows = fixture.nativeElement.querySelectorAll('.products-table tbody tr');

    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('SKU-001');
    expect(rows[1].textContent).toContain('SKU-002');
    expect(rows[2].textContent).toContain('SKU-003');
  });

  it('should show stock status badges', () => {
    const badges = Array.from(fixture.nativeElement.querySelectorAll('.badge')) as HTMLElement[];

    expect(badges.map((badge) => badge.textContent?.trim())).toEqual(['CRITICAL', 'LOW', 'OK']);
    expect(badges[0].classList).toContain('badge--critical');
    expect(badges[1].classList).toContain('badge--low');
    expect(badges[2].classList).toContain('badge--ok');
  });

  it('should call category filter method', () => {
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.value = 'Furniture';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(storeMock.setCategoryFilter).toHaveBeenCalledWith('Furniture');
    expect(storeMock.loadProducts).toHaveBeenCalledWith(0, 10, 'Furniture');
  });

  it('should clear the category filter', () => {
    storeMock.activeCategoryFilter.set('Electronics');

    component.clearCategoryFilter();

    expect(storeMock.setCategoryFilter).toHaveBeenCalledWith(null);
    expect(storeMock.loadProducts).toHaveBeenCalledWith(0, 10);
  });

  it('should navigate to the previous page', () => {
    storeMock.activeCategoryFilter.set('Electronics');
    component.currentPage = 2;

    component.previousPage();

    expect(storeMock.loadProducts).toHaveBeenCalledWith(1, 10, 'Electronics');
  });

  it('should do nothing when already on the first page', () => {
    component.currentPage = 0;

    component.previousPage();

    expect(storeMock.loadProducts).not.toHaveBeenCalled();
  });

  it('should navigate to the next page when more pages exist', () => {
    storeMock.activeCategoryFilter.set('Furniture');
    storeMock.productsPage.set(buildPageResponse(storeMock.products(), 0, 10, true, false));
    component.currentPage = 0;

    component.nextPage();

    expect(storeMock.loadProducts).toHaveBeenCalledWith(1, 10, 'Furniture');
  });

  it('should do nothing when there are no more pages', () => {
    storeMock.productsPage.set(buildPageResponse(storeMock.products(), 0, 10, true, true));
    component.currentPage = 0;

    component.nextPage();

    expect(storeMock.loadProducts).not.toHaveBeenCalled();
  });

  it('should call product selection when a row action is clicked', () => {
    const firstButton = fixture.nativeElement.querySelector('.link-button') as HTMLButtonElement;

    firstButton.click();

    expect(storeMock.selectProduct).toHaveBeenCalledWith(1);
  });

  it('should show empty state', () => {
    storeMock.products.set([]);
    storeMock.productsPage.set(null);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.state--empty') as HTMLElement;

    expect(emptyState.textContent?.trim()).toBe('No se encontraron productos con ese filtro.');
  });
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
      currentStock: 0,
      minimumStock: 3,
      unitPrice: 1000,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      sku: 'SKU-002',
      name: 'Office Chair',
      description: null,
      category: 'Furniture',
      currentStock: 2,
      minimumStock: 2,
      unitPrice: 120,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 3,
      sku: 'SKU-003',
      name: 'Notebook',
      description: null,
      category: 'Office Supplies',
      currentStock: 5,
      minimumStock: 2,
      unitPrice: 12.5,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]);
  store.productsPage = signal<PageResponse<Product> | null>(null);
  store.selectedProduct = signal<Product | null>(null);
  store.loading = signal(false);
  store.activeError = signal<ErrorResponse | null>(null);
  store.activeCategoryFilter = signal<string | null>(null);
  store.totalProductsCount = computed(() => store.products().length);
  store.criticalAlertsCount = computed(() => 0);
  store.totalInventoryValue = computed(() =>
    store.products().reduce((total: number, product: Product) => total + product.currentStock * product.unitPrice, 0)
  );
  store.loadProducts = jasmine.createSpy('loadProducts');
  store.loadAlerts = jasmine.createSpy('loadAlerts');
  store.selectProduct = jasmine.createSpy('selectProduct');
  store.setCategoryFilter = jasmine.createSpy('setCategoryFilter');

  return store;
}

function buildPageResponse(content: Product[], number: number, size: number, first: boolean, last: boolean): PageResponse<Product> {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size,
    number,
    first,
    last,
    empty: content.length === 0
  };
}
