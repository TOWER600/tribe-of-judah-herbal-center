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
import { ArrowRight, Loader2 } from 'lucide-react';
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
  const handleTransfer = async () => {
    if (!product || !fromBranch || !toBranch || fromBranch === toBranch) {
      toast.error("Invalid transfer parameters");
      return;
    }
    const qty = parseInt(quantity);
    if (qty <= 0 || qty > product.totalStock) {
      toast.error("Invalid quantity");
      return;
    }
    setIsSubmitting(true);
    try {
      // Logic for stock transfer (Simplified: just updating totalStock in this demo)
      // In a multi-branch entity system, you'd decrement source and increment target
      await api('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...product,
          totalStock: product.totalStock - qty // Just showing deduction for demo
        }),
      });
      toast.success(`Moved ${qty} units from ${branches?.find(b => b.id === fromBranch)?.name} to ${branches?.find(b => b.id === toBranch)?.name}`);
      onSuccess();
    } catch (error) {
      toast.error("Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };
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
                    <SelectItem key={b.id} value={b.id}>{b.name.split(' - ')[1]}</SelectItem>
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
                    <SelectItem key={b.id} value={b.id}>{b.name.split(' - ')[1]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Transfer Quantity</Label>
              <span className="text-xs text-muted-foreground">Available: {product?.totalStock} {product?.unit}s</span>
            </div>
            <Input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="text-lg font-bold text-center h-12"
            />
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
            <p className="font-medium text-slate-500 mb-2">Inventory Impact</p>
            <div className="flex justify-between">
              <span>Remaining at Source:</span>
              <span className="font-bold">{Math.max(0, (product?.totalStock || 0) - parseInt(quantity || '0'))} {product?.unit}s</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px]"
            disabled={isSubmitting}
            onClick={handleTransfer}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}