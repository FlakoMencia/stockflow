import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MovementType } from '../models/movement-type.enum';
import { MovementApiService } from './movement-api.service';

describe('MovementApiService', () => {
  let service: MovementApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(MovementApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a movement registration request', () => {
    service.registerMovement({
      productId: 3,
      type: MovementType.OUT,
      quantity: 4,
      reason: 'Damaged items'
    }).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/v1/movements');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      productId: 3,
      type: MovementType.OUT,
      quantity: 4,
      reason: 'Damaged items'
    });

    request.flush({
      id: 11,
      productId: 3,
      productSku: 'SKU-003',
      productName: 'Notebook',
      type: MovementType.OUT,
      quantity: 4,
      stockBefore: 10,
      stockAfter: 6,
      reason: 'Damaged items',
      occurredAt: '2024-01-01T00:00:00.000Z'
    });
  });

  it('should request movement history with query parameters', () => {
    service.getMovementHistory(8, 2, 15).subscribe();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/api/v1/movements/8/history?page=2&size=15'
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('15');

    request.flush([]);
  });
});
