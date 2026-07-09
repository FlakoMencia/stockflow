import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MovementApiService } from '../../core/api/movement-api.service';
import { MovementType } from '../../core/models/movement-type.enum';
import { InventoryStore } from '../../core/store/inventory.store';

@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movements-page.component.html',
  styleUrls: ['./movements-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovementsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly movementApi = inject(MovementApiService);
  private readonly selectionPageSize = 100;
  readonly store = inject(InventoryStore);

  readonly movementTypes = [MovementType.IN, MovementType.OUT] as const;

  readonly movementForm = this.fb.group({
    productId: [null as number | null, [Validators.required]],
    type: [null as MovementType | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', [Validators.required]]
  });

  submitting = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.refreshProducts();
  }

  refreshProducts(): void {
    this.store.loadProducts(0, this.selectionPageSize, this.store.activeCategoryFilter() ?? undefined);
  }

  registerMovement(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      return;
    }

    const { productId, type, quantity, reason } = this.movementForm.getRawValue();

    this.submitting = true;

    this.movementApi
      .registerMovement({
        productId: productId!,
        type: type!,
        quantity: quantity!,
        reason: reason!.trim()
      })
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage = this.resolveErrorMessage(error);
          return EMPTY;
        }),
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe((movement) => {
        this.successMessage = `Movement ${movement.type} registered for ${movement.productName}.`;
        this.submitted = false;
        this.movementForm.reset({
          productId: null,
          type: null,
          quantity: 1,
          reason: ''
        });
        this.refreshProducts();
        this.store.loadAlerts();
      });
  }

  hasError(control: 'productId' | 'type' | 'quantity' | 'reason', error: string): boolean {
    const formControl = this.movementForm.controls[control];
    return formControl.hasError(error) && (formControl.touched || this.submitted);
  }

  trackByProduct(_: number, product: { id: number }): number {
    return product.id;
  }

  trackByMovementType(_: number, value: MovementType): MovementType {
    return value;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      return error.error?.message ?? error.message ?? 'Unable to register movement.';
    }

    return error instanceof Error ? error.message : 'Unable to register movement.';
  }
}
