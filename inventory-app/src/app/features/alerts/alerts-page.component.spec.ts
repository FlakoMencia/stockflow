import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AlertSeverity } from '../../core/models/alert-severity.enum';
import { StockAlert } from '../../core/models/stock-alert.model';
import { InventoryStore } from '../../core/store/inventory.store';
import { AlertsPageComponent } from './alerts-page.component';

describe('AlertsPageComponent', () => {
  let fixture: ComponentFixture<AlertsPageComponent>;
  let storeMock: any;

  beforeEach(() => {
    storeMock = createStoreMock();

    TestBed.configureTestingModule({
      imports: [AlertsPageComponent, CommonModule],
      providers: [{ provide: InventoryStore, useValue: storeMock }]
    });

    fixture = TestBed.createComponent(AlertsPageComponent);
    fixture.detectChanges();
    storeMock.loadAlerts.calls.reset();
  });

  it('should render alerts', () => {
    const rows = fixture.nativeElement.querySelectorAll('.alerts-table tbody tr');

    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('SKU-001');
    expect(rows[1].textContent).toContain('SKU-002');
  });

  it('should show LOW/CRITICAL severity', () => {
    const badges = Array.from(fixture.nativeElement.querySelectorAll('.badge')) as HTMLElement[];

    expect(badges.map((badge) => badge.textContent?.trim())).toEqual(['CRITICAL', 'LOW']);
    expect(badges[0].classList).toContain('badge--critical');
    expect(badges[1].classList).toContain('badge--low');
  });

  it('should show empty state', () => {
    storeMock.activeAlerts.set([]);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.state--empty') as HTMLElement;

    expect(emptyState.textContent?.trim()).toBe('No active alerts at the moment.');
  });
});

function createStoreMock(): any {
  const store: any = {
    activeAlerts: signal<StockAlert[]>([
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
    ]),
    loading: signal(false),
    activeError: signal(null),
    loadAlerts: jasmine.createSpy('loadAlerts')
  };

  return store;
}
