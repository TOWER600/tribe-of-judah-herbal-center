import { create } from 'zustand';
import { Product, Branch, MOCK_BRANCHES } from '@shared/mock-data';
export interface CartItem extends Product {
  quantity: number;
}
interface PosState {
  cartItems: CartItem[];
  currentBranch: Branch;
  pricingMode: 'retail' | 'wholesale';
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  togglePricingMode: () => void;
  setBranch: (branch: Branch) => void;
  clearCart: () => void;
}
export const usePosStore = create<PosState>((set) => ({
  cartItems: [],
  currentBranch: MOCK_BRANCHES[0],
  pricingMode: 'retail',
  addItem: (product) => set((state) => {
    const existing = state.cartItems.find(item => item.id === product.id);
    if (existing) {
      return {
        cartItems: state.cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
  }),
  removeItem: (productId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0)
  })),
  togglePricingMode: () => set((state) => ({
    pricingMode: state.pricingMode === 'retail' ? 'wholesale' : 'retail'
  })),
  setBranch: (branch) => set({ currentBranch: branch }),
  clearCart: () => set({ cartItems: [] }),
}));