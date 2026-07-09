import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { AdvancedStatisticsComponent } from './advanced-statistics.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, AdvancedStatisticsComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  readonly store = inject(InventoryStore);

  ngOnInit(): void {
    this.store.loadProducts();
    this.store.loadAlerts();
  }
}
