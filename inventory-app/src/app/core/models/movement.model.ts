import { MovementType } from './movement-type.enum';

export interface Movement {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  type: MovementType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reason: string;
  occurredAt: string;
}
