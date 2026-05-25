import React from 'react';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartSidebar } from '@/components/pos/CartSidebar';
export default function PosPage() {
  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <ProductGrid />
      </div>
      <div className="w-[400px] h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col flex-shrink-0">
        <CartSidebar />
      </div>
    </div>
  );
}