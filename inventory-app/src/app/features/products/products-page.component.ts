import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { ProductHistoryPanelComponent } from './product-history-panel.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ProductHistoryPanelComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {
  readonly pageSize = 10;
  readonly store = inject(InventoryStore);
  readonly fallbackCategories = ['Electronics', 'Furniture', 'Office Supplies'] as const;

  currentPage = 0;

  ngOnInit(): void {
    this.currentPage = this.store.productsPage()?.number ?? 0;
    this.store.loadProducts(this.currentPage, this.pageSize, this.store.activeCategoryFilter() ?? undefined);
  }

  selectProduct(productId: number): void {
    this.store.selectProduct(productId);
  }

  refreshProducts(): void {
    this.store.loadProducts(this.currentPage, this.pageSize, this.store.activeCategoryFilter() ?? undefined);
  }

  get categoryOptions(): string[] {
    const loadedCategories = this.store
      .products()
      .map((product) => product.category)
      .filter((category): category is string => Boolean(category));
    return Array.from(new Set([...loadedCategories, ...this.fallbackCategories]));
  }

  onCategoryChange(event: Event): void {
    const rawCategory = (event.target as HTMLSelectElement).value;
    const category = this.normalizeCategory(rawCategory);
    this.currentPage = 0;
    this.store.setCategoryFilter(category);
    this.store.loadProducts(this.currentPage, this.pageSize, category ?? undefined);
  }

  clearCategoryFilter(): void {
    this.currentPage = 0;
    this.store.setCategoryFilter(null);
    this.store.loadProducts(this.currentPage, this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage === 0) {
      return;
    }

    this.currentPage -= 1;
    this.store.loadProducts(this.currentPage, this.pageSize, this.store.activeCategoryFilter() ?? undefined);
  }

  nextPage(): void {
    if (!this.canGoNext) {
      return;
    }

    this.currentPage += 1;
    this.store.loadProducts(this.currentPage, this.pageSize, this.store.activeCategoryFilter() ?? undefined);
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 0;
  }

  get canGoNext(): boolean {
    const lastPage = this.store.productsPage()?.last;
    if (typeof lastPage === 'boolean') {
      return !lastPage;
    }

    return this.store.products().length === this.pageSize;
  }

  get currentPageLabel(): number {
    return (this.store.productsPage()?.number ?? this.currentPage) + 1;
  }

  stockStatus(product: { currentStock: number; minimumStock: number }): 'CRITICAL' | 'LOW' | 'OK' {
    if (product.currentStock === 0 || product.currentStock < product.minimumStock) {
      return 'CRITICAL';
    }

    if (product.currentStock === product.minimumStock) {
      return 'LOW';
    }

    return 'OK';
  }

  private normalizeCategory(value: string | null): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }
}
