import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { Product } from '../../core/models/product.model';

type InventoryValueEntry = {
  product: Product;
  value: number;
};

@Component({
  selector: 'app-advanced-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advanced-statistics.component.html',
  styleUrls: ['./advanced-statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedStatisticsComponent {
  private readonly store = inject(InventoryStore);

  readonly stats = computed(() => {
    const products = this.store.products();

    const totalStock = products.reduce((sum, product) => sum + product.currentStock, 0);
    const belowMinimumStockCount = products.filter((product) => product.currentStock < product.minimumStock).length;
    const highestValueEntry = products.reduce<InventoryValueEntry | null>((best, product) => {
      const value = product.currentStock * product.unitPrice;

      if (best === null || value > best.value) {
        return { product, value };
      }

      return best;
    }, null);

    return {
      averageStock: products.length > 0 ? totalStock / products.length : 0,
      belowMinimumStockCount,
      highestValueProduct: highestValueEntry?.product ?? null,
      highestValue: highestValueEntry?.value ?? 0,
      totalInventoryValue: this.store.totalInventoryValue()
    };
  });
}
