import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product, ApiResponse } from '@shared/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, Package, Filter, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<{ items: Product[] }>('/api/products')
  });
  const products = productsData?.items ?? [];
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage herbal stock levels across all branches.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or SKU..." 
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-bold">Product Details</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold text-right">Retail Price</TableHead>
                <TableHead className="font-bold text-right">Stock Level</TableHead>
                <TableHead className="font-bold">Expiry Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="h-12 text-center animate-pulse bg-slate-50/50" />
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                    No products found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const isLowStock = product.totalStock < 10;
                  const expiryDate = new Date(product.expiryDate);
                  const isExpiringSoon = expiryDate.getTime() < Date.now() + (30 * 24 * 60 * 60 * 1000);
                  return (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₵{product.retailPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={isLowStock ? "text-red-500 font-bold" : "font-medium"}>
                          {product.totalStock} {product.unit}s
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={isExpiringSoon ? "text-amber-600 font-medium" : ""}>
                          {format(expiryDate, 'MMM dd, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Low Stock</Badge>
                        ) : isExpiringSoon ? (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Expiring Soon</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                          Restock <ArrowUpRight className="ml-1 w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}