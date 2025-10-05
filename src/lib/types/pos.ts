// Shared types for POS system

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  barcode?: string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}
