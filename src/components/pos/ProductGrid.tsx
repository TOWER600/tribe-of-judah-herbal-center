import React, { useState } from 'react';
import { Search, Package, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PRODUCTS } from '@shared/mock-data';
import { usePosStore } from '@/stores/usePosStore';
import { cn } from '@/lib/utils';
export function ProductGrid() {
  const [search, setSearch] = useState('');
  const pricingMode = usePosStore(s => s.pricingMode);
  const addItem = usePosStore(s => s.addItem);
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 space-y-6">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search items by name or category..."
          className="pl-12 h-14 text-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((product) => {
          const price = pricingMode === 'retail' ? product.retailPrice : product.wholesalePrice;
          const isLowStock = product.totalStock < 10;
          return (
            <Card
              key={product.id}
              className={cn(
                "group cursor-pointer hover:border-emerald-500 transition-all active:scale-95 border-slate-200 dark:border-slate-800",
                isLowStock && "border-amber-200 bg-amber-50/10"
              )}
              onClick={() => addItem(product)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <Package className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={isLowStock ? 'destructive' : 'secondary'} className="text-[10px]">
                      {product.totalStock} {product.unit}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-black text-emerald-600">
                    ₵{price.toFixed(2)}
                  </span>
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}