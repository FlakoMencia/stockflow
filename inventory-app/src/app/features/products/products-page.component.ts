import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {
  readonly pageSize = 10;
  readonly store = inject(InventoryStore);

  currentPage = 0;
  categoryDraft = '';

  ngOnInit(): void {
    this.categoryDraft = this.store.activeCategoryFilter() ?? '';
    this.store.loadProducts(this.currentPage, this.pageSize);
  }

  onCategoryDraftChange(event: Event): void {
    this.categoryDraft = (event.target as HTMLInputElement).value;
  }

  applyCategoryFilter(): void {
    const category = this.normalizeCategory(this.categoryDraft);
    this.currentPage = 0;
    this.categoryDraft = category ?? '';
    this.store.setCategoryFilter(category);
    this.store.loadProducts(this.currentPage, this.pageSize, category ?? undefined);
  }

  clearCategoryFilter(): void {
    this.currentPage = 0;
    this.categoryDraft = '';
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
    return this.store.products().length === this.pageSize;
  }

  get currentPageLabel(): number {
    return this.currentPage + 1;
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

  private normalizeCategory(value: string): string | null {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
}
