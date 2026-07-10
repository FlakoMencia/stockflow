import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MovementApiService } from '../../core/api/movement-api.service';
import { MovementType } from '../../core/models/movement-type.enum';
import { ProductHistoryPanelComponent } from './product-history-panel.component';

describe('ProductHistoryPanelComponent', () => {
  let fixture: ComponentFixture<ProductHistoryPanelComponent>;
  let movementApiSpy: jasmine.SpyObj<MovementApiService>;

  beforeEach(() => {
    movementApiSpy = jasmine.createSpyObj<MovementApiService>('MovementApiService', ['getMovementHistory']);

    TestBed.configureTestingModule({
      imports: [ProductHistoryPanelComponent, CommonModule],
      providers: [{ provide: MovementApiService, useValue: movementApiSpy }]
    });

    fixture = TestBed.createComponent(ProductHistoryPanelComponent);
  });

  it('should render movement history on success', () => {
    movementApiSpy.getMovementHistory.and.returnValue(
      of([
        {
          id: 1,
          productId: 7,
          productSku: 'SKU-007',
          productName: 'Monitor',
          type: MovementType.IN,
          quantity: 3,
          stockBefore: 2,
          stockAfter: 5,
          reason: 'Restock',
          occurredAt: '2024-01-01T00:00:00.000Z'
        }
      ])
    );

    fixture.componentRef.setInput('productId', 7);
    fixture.componentRef.setInput('productSku', 'SKU-007');
    fixture.componentRef.setInput('productName', 'Monitor');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.history-panel__table tbody tr');
    const header = fixture.nativeElement.querySelector('.history-panel__header p') as HTMLElement | null;

    expect(movementApiSpy.getMovementHistory).toHaveBeenCalledWith(7);
    expect(rows.length).toBe(1);
    expect(header).not.toBeNull();
    expect(header?.textContent?.trim()).toBe('SKU-007 - Monitor');
    expect((rows[0] as HTMLElement).textContent).toContain('IN');
    expect((rows[0] as HTMLElement).textContent).toContain('3');
    expect((rows[0] as HTMLElement).textContent).toContain('Restock');
  });

  it('should show empty state when the history is empty', () => {
    movementApiSpy.getMovementHistory.and.returnValue(of([]));

    fixture.componentRef.setInput('productId', 7);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.history-panel__empty') as HTMLElement;

    expect(emptyState.textContent?.trim()).toBe('No hay movimientos registrados para este producto.');
  });

  it('should show an error when the history request fails', () => {
    movementApiSpy.getMovementHistory.and.returnValue(throwError(() => new Error('History unavailable')));

    fixture.componentRef.setInput('productId', 7);
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('.history-panel__error') as HTMLElement;

    expect(errorState.textContent).toContain('No se pudo cargar el historial.');
    expect(errorState.textContent).toContain('History unavailable');
  });
});
