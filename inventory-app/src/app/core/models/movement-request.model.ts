import { MovementType } from './movement-type.enum';

export interface MovementRequest {
  productId: number;
  type: MovementType;
  quantity: number;
  reason: string;
}
