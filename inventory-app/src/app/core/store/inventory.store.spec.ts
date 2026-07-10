import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { flush } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { AlertApiService } from '../api/alert-api.service';
import { ProductApiService } from '../api/product-api.service';
import { AlertSeverity } from '../models/alert-severity.enum';
import { ErrorResponse } from '../models/error-response.model';
import { PageResponse } from '../models/page-response.model';
import { Product } from '../models/product.model';
import { StockAlert } from '../models/stock-alert.model';
import { ToastService } from '../services/toast.service';
import { InventoryStore } from './inventory.store';

describe('InventoryStore', () => {
  let productApiSpy: jasmine.SpyObj<ProductApiService>;
  let alertApiSpy: jasmine.SpyObj<AlertApiService>;
  let toastServiceSpy: any;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('stockflow.inventory.categoryFilter');
    }

    productApiSpy = jasmine.createSpyObj<ProductApiService>('ProductApiService', ['getProducts', 'getProductById']);
    alertApiSpy = jasmine.createSpyObj<AlertApiService>('AlertApiService', ['getAlerts']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['warning']);

    TestBed.configureTestingModule({
      providers: [
        InventoryStore,
        { provide: ProductApiService, useValue: productApiSpy },
        { provide: AlertApiService, useValue: alertApiSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });
  });

  it('should calculate products, critical alerts and inventory value through computed signals', () => {
    const store = createStore();

    store.products.set([
      buildProduct(1, 'SKU-001', 'Laptop', 'Electronics', 10, 3, 1250),
      buildProduct(2, 'SKU-002', 'Chair', 'Furniture', 4, 2, 85.5)
    ]);
    store.activeAlerts.set([
      buildAlert(1, 'SKU-001', 'Laptop', 0, 3, AlertSeverity.CRITICAL),
      buildAlert(2, 'SKU-002', 'Chair', 2, 2, AlertSeverity.LOW)
    ]);

    expect(store.totalProductsCount()).toBe(2);
    expect(store.criticalAlertsCount()).toBe(1);
    expect(store.totalInventoryValue()).toBe(12842);
  });

  it('should load products successfully and finalize loading state', () => {
    const store = createStore();
    const response$ = new Subject<PageResponse<Product>>();
    const page = buildPageResponse([
      buildProduct(1, 'SKU-001', 'Laptop', 'Electronics', 10, 3, 1250),
      buildProduct(2, 'SKU-002', 'Chair', 'Furniture', 4, 2, 85.5)
    ], 2, 25, false, false);

    productApiSpy.getProducts.and.returnValue(response$.asObservable());

    store.loadProducts(2, 25, 'Electronics');

    expect(store.loading()).toBeTrue();
    expect(productApiSpy.getProducts).toHaveBeenCalledWith(2, 25, 'Electronics');

    response$.next(page);
    response$.complete();

    expect(store.loading()).toBeFalse();
    expect(store.productsPage()).toEqual(page);
    expect(store.products()).toEqual(page.content);
    expect(store.activeError()).toBeNull();
  });

  it('should handle load products errors and finalize loading state', () => {
    const store = createStore();
    const httpError = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      error: { message: 'Unable to load products' }
    });

    productApiSpy.getProducts.and.returnValue(throwError(() => httpError));

    store.loadProducts();

    expect(store.loading()).toBeFalse();
    expect(store.activeError()).toEqual(
      jasmine.objectContaining({
        status: 500,
        error: 'Server Error',
        message: 'Unable to load products',
        path: '/api/v1/products'
      })
    );
  });

  it('should load products using the active category filter when no category is passed', () => {
    const store = createStore();
    const response$ = new Subject<PageResponse<Product>>();
    const page = buildPageResponse([buildProduct(1, 'SKU-001', 'Laptop', 'Electronics', 10, 3, 1250)], 0, 10, true, true);

    productApiSpy.getProducts.and.returnValue(response$.asObservable());
    store.setCategoryFilter('Electronics');

    store.loadProducts();

    expect(productApiSpy.getProducts).toHaveBeenCalledWith(0, 10, 'Electronics');

    response$.next(page);
    response$.complete();

    expect(store.products()).toEqual(page.content);
  });


  it('should handle load alerts errors and keep loading state finalized', () => {
    const store = createStore();
    const httpError = new HttpErrorResponse({
      status: 0,
      statusText: '',
      error: new ProgressEvent('error')
    });

    alertApiSpy.getAlerts.and.returnValue(throwError(() => httpError));

    store.loadAlerts();

    expect(store.loading()).toBeFalse();
    expect(store.activeError()).toEqual(
      jasmine.objectContaining({
        status: 503,
        error: 'Service Unavailable',
        message: 'Inventory service is currently unavailable. Please try again later.',
        path: '/api/v1/alerts'
      })
    );
  });

  it('should select a product successfully and finalize loading state', () => {
    const store = createStore();
    const product = buildProduct(7, 'SKU-007', 'Monitor', 'Electronics', 5, 2, 250);

    productApiSpy.getProductById.and.returnValue(of(product));

    store.selectProduct(7);

    expect(store.loading()).toBeFalse();
    expect(productApiSpy.getProductById).toHaveBeenCalledWith(7);
    expect(store.selectedProduct()).toEqual(product);
    expect(store.activeError()).toBeNull();
  });

  it('should handle select product errors and finalize loading state', () => {
    const store = createStore();
    const httpError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { message: 'Product not found' }
    });

    productApiSpy.getProductById.and.returnValue(throwError(() => httpError));

    store.selectProduct(9);

    expect(store.loading()).toBeFalse();
    expect(store.selectedProduct()).toBeNull();
    expect(store.activeError()).toEqual(
      jasmine.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'Product not found',
        path: '/api/v1/products/9'
      })
    );
  });

  it('should select an already loaded product without calling the API again', () => {
    const store = createStore();
    const product = buildProduct(1, 'SKU-001', 'Laptop', 'Electronics', 10, 3, 1250);

    store.products.set([product]);
    store.selectProduct(1);

    expect(productApiSpy.getProductById).not.toHaveBeenCalled();
    expect(store.selectedProduct()).toEqual(product);
    expect(store.loading()).toBeFalse();
  });

  it(
    'should persist the category filter to localStorage and remove it when cleared',
    fakeAsync(() => {
    const store = createStore();

    store.setCategoryFilter(' Electronics ');
    flush();
    TestBed.flushEffects();

    expect(store.activeCategoryFilter()).toBe('Electronics');
    expect(localStorage.getItem('stockflow.inventory.categoryFilter')).toBe('Electronics');

    store.setCategoryFilter(null);
    flush();
    TestBed.flushEffects();

    expect(store.activeCategoryFilter()).toBeNull();
    expect(localStorage.getItem('stockflow.inventory.categoryFilter')).toBeNull();
    })
  );

  it('should initialize the category filter from localStorage', () => {
    localStorage.setItem('stockflow.inventory.categoryFilter', 'Furniture');

    const store = createStore();

    expect(store.activeCategoryFilter()).toBe('Furniture');
  });

  it('should clear selected product, clear error and normalize the category filter', () => {
    const store = createStore();
    const product = buildProduct(1, 'SKU-001', 'Laptop', 'Electronics', 10, 3, 1250);
    const error: ErrorResponse = {
      timestamp: '2024-01-01T00:00:00.000Z',
      status: 500,
      error: 'Error',
      message: 'Boom',
      path: '/api/v1/products'
    };

    store.selectedProduct.set(product);
    store.activeError.set(error);
    store.setCategoryFilter('  Office Supplies  ');
    store.clearSelectedProduct();
    store.clearError();

    expect(store.selectedProduct()).toBeNull();
    expect(store.activeError()).toBeNull();
    expect(store.activeCategoryFilter()).toBe('Office Supplies');
  });

  function createStore(): InventoryStore {
    return TestBed.inject(InventoryStore);
  }
});

function buildProduct(
  id: number,
  sku: string,
  name: string,
  category: string,
  currentStock: number,
  minimumStock: number,
  unitPrice: number
): Product {
  return {
    id,
    sku,
    name,
    description: null,
    category,
    currentStock,
    minimumStock,
    unitPrice,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };
}

function buildAlert(
  productId: number,
  sku: string,
  name: string,
  currentStock: number,
  minimumStock: number,
  severity: AlertSeverity
): StockAlert {
  return {
    productId,
    productSku: sku,
    productName: name,
    currentStock,
    minimumStock,
    severity,
    generatedAt: '2024-01-01T00:00:00.000Z'
  };
}

function buildPageResponse(
  content: Product[],
  number: number,
  size: number,
  first: boolean,
  last: boolean
): PageResponse<Product> {
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
