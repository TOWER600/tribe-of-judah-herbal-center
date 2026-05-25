import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { usePosStore } from '@/stores/usePosStore';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function CheckoutModal({ total, children }: { total: number, children: React.ReactNode }) {
  const [tendered, setTendered] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = usePosStore(s => s.cartItems);
  const branch = usePosStore(s => s.currentBranch);
  const pricingMode = usePosStore(s => s.pricingMode);
  const clearCart = usePosStore(s => s.clearCart);
  const amountTendered = parseFloat(tendered) || 0;
  const change = amountTendered - total;
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const salePayload = {
        branchId: branch.id,
        branchName: branch.name,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: pricingMode === 'retail' ? item.retailPrice : item.wholesalePrice,
          total: (pricingMode === 'retail' ? item.retailPrice : item.wholesalePrice) * item.quantity
        })),
        subtotal: total * 0.95,
        tax: total * 0.05,
        total: total,
        paymentMethod: 'cash',
        pricingMode: pricingMode
      };
      await api('/api/sales', {
        method: 'POST',
        body: JSON.stringify(salePayload)
      });
      setIsCompleted(true);
      toast.success("Sale completed successfully!");
      // Short delay to ensure Success UI is visible before print dialog
      setTimeout(() => {
        window.print();
      }, 700);
    } catch (error) {
      toast.error("Critical: Failed to sync transaction. Check connection.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (isCompleted) clearCart();
    setIsCompleted(false);
    setTendered('');
  };
  return (
    <Dialog onOpenChange={(open) => !open && handleClose()}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0">
        {!isCompleted ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-black">Checkout</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl text-center space-y-1">
                <p className="text-slate-500 font-medium">Total Amount Due</p>
                <p className="text-4xl font-black text-emerald-600">₵{total.toFixed(2)}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-lg font-bold">Cash Tendered</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount received..."
                    className="h-14 text-2xl font-bold text-center bg-slate-50 dark:bg-slate-800"
                    value={tendered}
                    onChange={(e) => setTendered(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 50, 100].map(amt => (
                    <Button
                      key={amt}
                      variant="outline"
                      onClick={() => setTendered(amt.toString())}
                      className="h-12 font-bold"
                    >
                      ₵{amt}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Change</span>
                <span className="text-2xl font-black text-emerald-600">
                  ₵{Math.max(0, change).toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 font-bold text-lg gap-2"
                disabled={amountTendered < total || isSubmitting}
                onClick={handleComplete}
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Complete Sale
              </Button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black">Sale Success!</h2>
              <p className="text-slate-500">Transaction recorded. Printing receipt...</p>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={handleClose}>
              Start New Sale
            </Button>
          </div>
        )}
        <div className="hidden print:block fixed inset-0 bg-white p-8 font-mono text-sm print-receipt">
          <div className="text-center space-y-1 mb-4">
            <h1 className="font-bold text-xl uppercase">Tribe of Judah</h1>
            <p className="text-xs uppercase tracking-widest font-bold">Herbal Center</p>
            <p>{branch.name}</p>
            <p className="text-[10px]">{branch.location}</p>
            <div className="border-t border-dashed my-3" />
          </div>
          <div className="space-y-1 mb-4 text-[12px]">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Terminal:</span>
              <span className="uppercase">{pricingMode} POS</span>
            </div>
          </div>
          <table className="w-full mb-4 text-[12px]">
            <thead className="border-b border-dashed">
              <tr className="text-left font-bold">
                <th className="py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-slate-200">
              {cartItems.map(item => {
                const price = pricingMode === 'retail' ? item.retailPrice : item.wholesalePrice;
                return (
                  <tr key={item.id}>
                    <td className="py-1 pr-2 truncate max-w-[120px]">{item.name}</td>
                    <td className="text-right py-1">{item.quantity}</td>
                    <td className="text-right py-1 font-bold">₵{(price * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="space-y-1 border-t border-dashed pt-4 mb-8 text-[13px]">
            <div className="flex justify-between font-black text-base">
              <span>TOTAL:</span>
              <span>₵{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CASH TENDERED:</span>
              <span>₵{amountTendered.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>CHANGE:</span>
              <span>₵{change.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-center space-y-1 text-[10px] mt-10">
            <p className="font-bold">Thank you for choosing Nature's Remedy!</p>
            <p>Visit us again. Stay Healthy.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}