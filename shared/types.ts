export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Branch {
  id: string;
  name: string;
  location: string;
}
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  totalStock: number;
  unit: string;
  expiryDate: string;
}
export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}
export interface Sale {
  id: string;
  branchId: string;
  branchName: string;
  timestamp: number; // epoch millis
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'momo' | 'card';
  pricingMode: 'retail' | 'wholesale';
}
export interface CartItem extends Product {
  quantity: number;
}