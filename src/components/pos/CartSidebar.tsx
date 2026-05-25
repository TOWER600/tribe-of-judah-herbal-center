import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePosStore } from '@/stores/usePosStore';
import { CheckoutModal } from './CheckoutModal';
export function CartSidebar() {
  const cartItems = usePosStore(s => s.cartItems);
  const pricingMode = usePosStore(s => s.pricingMode);
  const updateQuantity = usePosStore(s => s.updateQuantity);
  const removeItem = usePosStore(s => s.removeItem);
  const clearCart = usePosStore(s => s.clearCart);
  const total = cartItems.reduce((acc, item) => {
    const price = pricingMode === 'retail' ? item.retailPrice : item.wholesalePrice;
    return acc + (price * item.quantity);
  }, 0);
  return (
    <>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-lg">Current Order</h2>
          <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold">
            {cartItems.length}
          </span>
        </div>
        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-slate-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50">
            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
              <ShoppingBag className="w-12 h-12 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium italic">Your cart is empty. Click a product to add it.</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cartItems.map((item) => {
              const price = pricingMode === 'retail' ? item.retailPrice : item.wholesalePrice;
              return (
                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">₵{price.toFixed(2)} / unit</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      className="p-1 hover:text-emerald-600 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      className="p-1 hover:text-emerald-600 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="font-black text-sm">₵{(price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium">₵{(total * 0.95).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax (Estimated)</span>
            <span className="font-medium">₵{(total * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-lg font-bold">Total Payable</span>
            <span className="text-3xl font-black text-emerald-600">₵{total.toFixed(2)}</span>
          </div>
        </div>
        <CheckoutModal total={total}>
          <Button
            className="w-full h-16 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-2xl gap-2"
            disabled={cartItems.length === 0}
          >
            <CreditCard className="w-6 h-6" />
            Checkout Order
          </Button>
        </CheckoutModal>
      </div>
    </>
  );
}