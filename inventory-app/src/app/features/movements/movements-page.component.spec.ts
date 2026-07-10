import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { MovementApiService } from '../../core/api/movement-api.service';
import { ErrorResponse } from '../../core/models/error-response.model';
import { Movement } from '../../core/models/movement.model';
import { MovementType } from '../../core/models/movement-type.enum';
import { Product } from '../../core/models/product.model';
import { InventoryStore } from '../../core/store/inventory.store';
import { MovementsPageComponent } from './movements-page.component';

describe('MovementsPageComponent', () => {
  let fixture: ComponentFixture<MovementsPageComponent>;
  let component: MovementsPageComponent;
  let storeMock: any;
  let movementApiSpy: any;

  beforeEach(() => {
    storeMock = createStoreMock();
    movementApiSpy = jasmine.createSpyObj('MovementApiService', ['registerMovement']);

    TestBed.configureTestingModule({
      imports: [MovementsPageComponent, CommonModule],
      providers: [
        { provide: InventoryStore, useValue: storeMock },
        { provide: MovementApiService, useValue: movementApiSpy }
      ]
    });

    fixture = TestBed.createComponent(MovementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storeMock.loadProducts.calls.reset();
    storeMock.loadAlerts.calls.reset();
    movementApiSpy.registerMovement.calls.reset();
  });

  it('should validate required fields', () => {

    component.movementForm.patchValue({
      productId: null,
      type: null,
      quantity: 0,
      reason: ''
    });

    component.registerMovement();

    expect(component.movementForm.invalid).toBeTrue();

    expect(component.movementForm.controls.productId.hasError('required'))
        .toBeTrue();

    expect(component.movementForm.controls.type.hasError('required'))
        .toBeTrue();

    expect(component.movementForm.controls.quantity.hasError('min'))
        .toBeTrue();

    expect(component.movementForm.controls.reason.hasError('required'))
        .toBeTrue();

    expect(movementApiSpy.registerMovement)
        .not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting if possible', () => {
    const pendingRequest = new Subject<Movement>();

    movementApiSpy.registerMovement.and.returnValue(pendingRequest.asObservable());
    fillValidForm();

    component.registerMovement();
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(component.submitting).toBeTrue();
    expect(submitButton.disabled).toBeTrue();
    pendingRequest.complete();
  });

  it('should call movement registration service with valid form data', () => {
    const movement: Movement = {
      id: 15,
      productId: 1,
      productSku: 'SKU-001',
      productName: 'Laptop',
      type: MovementType.IN,
      quantity: 2,
      stockBefore: 5,
      stockAfter: 7,
      reason: 'Restock order',
      occurredAt: '2024-01-01T00:00:00.000Z'
    };

    movementApiSpy.registerMovement.and.returnValue(of(movement));
    fillValidForm(' Restock order ');

    component.registerMovement();
    fixture.detectChanges();

    expect(movementApiSpy.registerMovement).toHaveBeenCalledWith({
      productId: 1,
      type: MovementType.IN,
      quantity: 2,
      reason: 'Restock order'
    });
  });

    it('should show an error and finalize submitting state when movement registration fails', () => {
      const insufficientStockMessage = 'Stock insuficiente para el producto 1. Solicitado: 50 unidades. Disponible: 5 unidades.';

      movementApiSpy.registerMovement.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 422,
            statusText: 'Unprocessable Entity',
            error: { message: insufficientStockMessage }
          })
      )
    );
    fillValidForm();

    component.registerMovement();
    fixture.detectChanges();

    expect(component.submitting).toBeFalse();
    expect(component.errorMessage).toBe(insufficientStockMessage);
    expect(component.successMessage).toBe('');
  });

  it('should reset the form and reload products and alerts after a successful registration', () => {
    const movement: Movement = {
      id: 18,
      productId: 1,
      productSku: 'SKU-001',
      productName: 'Laptop',
      type: MovementType.OUT,
      quantity: 1,
      stockBefore: 5,
      stockAfter: 4,
      reason: 'Damaged item',
      occurredAt: '2024-01-01T00:00:00.000Z'
    };

    movementApiSpy.registerMovement.and.returnValue(of(movement));
    fillValidForm('Damaged item');

    component.registerMovement();
    fixture.detectChanges();

    expect(component.submitting).toBeFalse();
    expect(component.successMessage).toBe('Movement OUT registered for Laptop.');
    expect(component.movementForm.value).toEqual({
      productId: null,
      type: null,
      quantity: 1,
      reason: ''
    });
    expect(storeMock.loadProducts).toHaveBeenCalledTimes(1);
    expect(storeMock.loadAlerts).toHaveBeenCalledTimes(1);
  });

  function fillValidForm(reason = 'Restock') {
    component.movementForm.setValue({
      productId: 1,
      type: MovementType.IN,
      quantity: 2,
      reason
    });
  }
});

function createStoreMock(): any {
  const store: any = {
    products: signal<Product[]>([
      {
        id: 1,
        sku: 'SKU-001',
        name: 'Laptop',
        description: null,
        category: 'Electronics',
        currentStock: 5,
        minimumStock: 2,
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
        currentStock: 3,
        minimumStock: 2,
        unitPrice: 120,
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]),
    loading: signal(false),
    activeError: signal<ErrorResponse | null>(null),
    activeCategoryFilter: signal<string | null>(null),
    loadProducts: jasmine.createSpy('loadProducts'),
    loadAlerts: jasmine.createSpy('loadAlerts')
  };

  return store;
}
