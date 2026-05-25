import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product, Branch } from '@shared/types';
import { toast } from 'sonner';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}
export function TransferModal({ open, onOpenChange, product, onSuccess }: TransferModalProps) {
  const [fromBranch, setFromBranch] = useState<string>('');
  const [toBranch, setToBranch] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => api<Branch[]>('/api/branches')
  });
  if (!product && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <p className="font-medium">No product selected for transfer.</p>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  const handleTransfer = async () => {
    if (!product || !fromBranch || !toBranch) {
      toast.error("Please select source and destination branches");
      return;
    }
    if (fromBranch === toBranch) {
      toast.error("Source and destination branches must be different");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0 || qty > product.totalStock) {
      toast.error(`Invalid quantity. Must be a whole number between 1 and ${product.totalStock}`);
      return;
    }
    setIsSubmitting(true);
    try {
      await api('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...product,
          totalStock: product.totalStock - qty
        }),
      });
      const fromName = branches?.find(b => b.id === fromBranch)?.name || 'Source';
      const toName = branches?.find(b => b.id === toBranch)?.name || 'Destination';
      toast.success(`Inventory updated: ${qty} ${product.unit}s moving from ${fromName} to ${toName}`);
      onSuccess();
    } catch (error) {
      toast.error("Stock transfer registry failed");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const parsedQty = Math.floor(parseFloat(quantity) || 0);
  const remainingQty = Math.max(0, (product?.totalStock || 0) - parsedQty);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Stock Transfer: <span className="text-emerald-600">{product?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <Label>Source Branch</Label>
              <Select onValueChange={setFromBranch} value={fromBranch}>
                <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                <SelectContent>
                  {branches?.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name.split(' - ').pop()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 mt-6" />
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select onValueChange={setToBranch} value={toBranch}>
                <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
                <SelectContent>
                  {branches?.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name.split(' - ').pop()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Transfer Quantity (Whole {product?.unit}s)</Label>
              <span className="text-xs text-muted-foreground font-medium">
                Max: {product?.totalStock}
              </span>
            </div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-lg font-bold text-center h-12 bg-slate-50 dark:bg-slate-800"
              min="1"
              step="1"
              max={product?.totalStock}
            />
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
            <p className="font-bold text-slate-500 mb-2 uppercase text-[10px] tracking-widest">Inventory Impact</p>
            <div className="flex justify-between">
              <span>Remaining at Source:</span>
              <span className={cn("font-bold", remainingQty < 10 ? "text-red-500" : "text-emerald-600")}>
                {remainingQty} {product?.unit}s
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px] font-bold"
            disabled={isSubmitting || parsedQty <= 0 || parsedQty > (product?.totalStock || 0) || !fromBranch || !toBranch || fromBranch === toBranch}
            onClick={handleTransfer}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}