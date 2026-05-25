import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
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
import { Search, Plus, Filter, ArrowRightLeft, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ProductModal } from '@/components/inventory/ProductModal';
import { TransferModal } from '@/components/inventory/TransferModal';
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<{ items: Product[] }>('/api/products')
  });
  const products = productsData?.items ?? [];
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };
  const handleAdd = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };
  const handleTransfer = (product: Product) => {
    setSelectedProduct(product);
    setIsTransferModalOpen(true);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory Console</h1>
            <p className="text-muted-foreground mt-1">Manage stock across Kasoa and Kaneshie locations.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsTransferModalOpen(true)}>
              <ArrowRightLeft className="w-4 h-4" /> Stock Transfer
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, name, or category..."
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="w-4 h-4" /> Category Filter
          </Button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-bold">SKU & Product Name</TableHead>
                <TableHead className="font-bold text-right">Price (R/W)</TableHead>
                <TableHead className="font-bold text-right">Stock</TableHead>
                <TableHead className="font-bold">Expiry</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-16 text-center animate-pulse bg-slate-50/50" />
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No products matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const isLowStock = product.totalStock < 10;
                  const expiryDate = new Date(product.expiryDate);
                  const isExpiringSoon = expiryDate.getTime() < Date.now() + (30 * 24 * 60 * 60 * 1000);
                  return (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{product.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-emerald-600">₵{product.retailPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground">₵{product.wholesalePrice.toFixed(2)} Wholesale</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={isLowStock ? "text-red-500 font-bold" : "font-medium"}>
                          {product.totalStock} {product.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={isExpiringSoon ? "text-amber-600 font-medium" : ""}>
                          {format(expiryDate, 'MMM dd, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive" className="text-[10px] uppercase">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase border-emerald-200 text-emerald-600 bg-emerald-50">Stable</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                            onClick={() => handleTransfer(product)}
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ProductModal 
        open={isProductModalOpen} 
        onOpenChange={setIsProductModalOpen} 
        product={selectedProduct}
        onSuccess={() => {
          refetch();
          setIsProductModalOpen(false);
        }}
      />
      <TransferModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        product={selectedProduct}
        onSuccess={() => {
          refetch();
          setIsTransferModalOpen(false);
        }}
      />
    </div>
  );
}