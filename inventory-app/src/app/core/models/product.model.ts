export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
