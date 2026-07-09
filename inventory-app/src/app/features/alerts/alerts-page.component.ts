import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-page.component.html',
  styleUrls: ['./alerts-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsPageComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    this.store.loadAlerts();
  }
}
