export interface Branch {
  id: string;
  name: string;
  location: string;
}
export interface Product {
  id: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
  expiryDate: string;
}
export const MOCK_BRANCHES: Branch[] = [
  { id: 'br-1', name: 'Tribe of Judah - Kasoa', location: 'Kasoa High Street' },
  { id: 'br-2', name: 'Tribe of Judah - Kaneshie', location: 'Kaneshie Market Area' },
];
export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Herbal Immune Booster (500ml)', category: 'Mixtures', retailPrice: 45.00, wholesalePrice: 35.00, stock: 120, unit: 'Bottle', expiryDate: '2025-12-01' },
  { id: 'p2', name: 'Natural Skin Glow Soap', category: 'Soaps', retailPrice: 15.00, wholesalePrice: 10.00, stock: 8, unit: 'Piece', expiryDate: '2026-06-15' },
  { id: 'p3', name: 'Detoxifying Root Tea', category: 'Teas', retailPrice: 25.00, wholesalePrice: 18.00, stock: 45, unit: 'Pack', expiryDate: '2025-08-20' },
  { id: 'p4', name: 'Organic Moringa Powder', category: 'Supplements', retailPrice: 30.00, wholesalePrice: 22.00, stock: 3, unit: 'Jar', expiryDate: '2025-05-10' },
  { id: 'p5', name: 'Bitters Compound', category: 'Mixtures', retailPrice: 50.00, wholesalePrice: 40.00, stock: 65, unit: 'Bottle', expiryDate: '2025-11-30' },
  { id: 'p6', name: 'Neem & Turmeric Balm', category: 'Topicals', retailPrice: 20.00, wholesalePrice: 14.00, stock: 30, unit: 'Tin', expiryDate: '2027-01-01' },
];
export const MOCK_SALES_STATS = [
  { name: 'Mon', kasoa: 4000, kaneshie: 2400 },
  { name: 'Tue', kasoa: 3000, kaneshie: 1398 },
  { name: 'Wed', kasoa: 2000, kaneshie: 9800 },
  { name: 'Thu', kasoa: 2780, kaneshie: 3908 },
  { name: 'Fri', kasoa: 1890, kaneshie: 4800 },
  { name: 'Sat', kasoa: 2390, kaneshie: 3800 },
  { name: 'Sun', kasoa: 3490, kaneshie: 4300 },
];