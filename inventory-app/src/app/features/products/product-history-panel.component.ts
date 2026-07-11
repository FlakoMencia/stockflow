import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MovementApiService } from '../../core/api/movement-api.service';
import { Movement } from '../../core/models/movement.model';

@Component({
  selector: 'app-product-history-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-history-panel.component.html',
  styleUrls: ['./product-history-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductHistoryPanelComponent implements OnChanges {
  private readonly movementApi = inject(MovementApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) productId = 0;
  @Input() productSku = '';
  @Input() productName = '';

  movements: Movement[] = [];
  loading = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId > 0) {
      this.loadHistory();
    }
  }

  trackByMovementId(_: number, movement: Movement): number {
    return movement.id;
  }

  private loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';
    this.movements = [];
    this.cdr.markForCheck();

    this.movementApi
      .getMovementHistory(this.productId)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage = this.resolveErrorMessage(error);
          this.cdr.markForCheck();
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((movements) => {
        this.movements = [...movements];
        this.cdr.markForCheck();
      });
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      return error.error?.message ?? error.message ?? 'No pudimos cargar el historial.';
    }

    return error instanceof Error ? error.message : 'No pudimos cargar el historial.';
  }
}
