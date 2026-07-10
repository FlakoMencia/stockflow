import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request products with pagination and category query parameters', () => {
    service.getProducts(2, 25, 'Electronics').subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/v1/products?page=2&size=25&category=Electronics');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('25');
    expect(request.request.params.get('category')).toBe('Electronics');

    request.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 25,
      number: 2,
      first: false,
      last: true,
      empty: true
    });
  });

  it('should request products without category when filter is omitted', () => {
    service.getProducts(0, 10).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/v1/products?page=0&size=10');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.has('category')).toBeFalse();

    request.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0,
      first: true,
      last: true,
      empty: true
    });
  });

  it('should request a product by id', () => {
    service.getProductById(7).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/v1/products/7');

    expect(request.request.method).toBe('GET');

    request.flush({
      id: 7,
      sku: 'SKU-007',
      name: 'Monitor',
      description: null,
      category: 'Electronics',
      currentStock: 5,
      minimumStock: 2,
      unitPrice: 250,
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    });
  });
});
