import { AlertSeverity } from './alert-severity.enum';

export interface StockAlert {
  productId: number;
  productSku: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: AlertSeverity;
  generatedAt: string;
}
