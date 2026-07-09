import { TestBed } from '@angular/core/testing';
import { AlertApiService } from '../api/alert-api.service';
import { ProductApiService } from '../api/product-api.service';
import { AlertSeverity } from '../models/alert-severity.enum';
import { ToastService } from '../services/toast.service';
import { InventoryStore } from './inventory.store';

describe('InventoryStore', () => {
  let store: InventoryStore;
  let productApiSpy: { getProducts: jasmine.Spy; getProductById: jasmine.Spy };
  let alertApiSpy: { getAlerts: jasmine.Spy };
  let toastServiceSpy: { warning: jasmine.Spy };

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('stockflow.inventory.categoryFilter');
    }

    productApiSpy = jasmine.createSpyObj('ProductApiService', ['getProducts', 'getProductById']);
    alertApiSpy = jasmine.createSpyObj('AlertApiService', ['getAlerts']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['warning']);

    TestBed.configureTestingModule({
      providers: [
        InventoryStore,
        { provide: ProductApiService, useValue: productApiSpy },
        { provide: AlertApiService, useValue: alertApiSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    store = TestBed.inject(InventoryStore);
  });

  it('should calculate total products using computed()', () => {
    store.products.set([
      {
        id: 1,
        sku: 'SKU-001',
        name: 'Laptop',
        description: null,
        category: 'Electronics',
        currentStock: 10,
        minimumStock: 3,
        unitPrice: 1250,
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
        currentStock: 4,
        minimumStock: 2,
        unitPrice: 85.5,
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]);

    expect(store.totalProductsCount()).toBe(2);
  });

  it('should calculate critical alerts count using computed()', () => {
    store.activeAlerts.set([
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

    expect(store.criticalAlertsCount()).toBe(1);
  });

  it('should calculate total inventory value using computed()', () => {
    store.products.set([
      {
        id: 1,
        sku: 'SKU-001',
        name: 'Laptop',
        description: null,
        category: 'Electronics',
        currentStock: 10,
        minimumStock: 3,
        unitPrice: 1250,
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
        currentStock: 4,
        minimumStock: 2,
        unitPrice: 85.5,
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]);

    expect(store.totalInventoryValue()).toBe(12842);
  });
});
