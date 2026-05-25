import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Printer } from 'lucide-react';
import { usePosStore } from '@/stores/usePosStore';
export function CheckoutModal({ total, children }: { total: number, children: React.ReactNode }) {
  const [tendered, setTendered] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const cartItems = usePosStore(s => s.cartItems);
  const branch = usePosStore(s => s.currentBranch);
  const clearCart = usePosStore(s => s.clearCart);
  const amountTendered = parseFloat(tendered) || 0;
  const change = amountTendered - total;
  const handleComplete = () => {
    setIsCompleted(true);
    // Print handled by a separate component or window.print call
    setTimeout(() => {
      window.print();
    }, 100);
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
                    className="h-14 text-2xl font-bold text-center bg-slate-50"
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
                <span className="font-bold text-emerald-700">Change</span>
                <span className="text-2xl font-black text-emerald-600">
                  ₵{Math.max(0, change).toFixed(2)}
                </span>
              </div>
              <Button 
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 font-bold text-lg"
                disabled={amountTendered < total}
                onClick={handleComplete}
              >
                Complete Sale
              </Button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
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
        {/* Hidden Receipt for Printing */}
        <div className="hidden print:block fixed inset-0 bg-white p-8 font-mono text-sm print-receipt">
          <div className="text-center space-y-1 mb-6">
            <h1 className="font-bold text-xl uppercase">Tribe of Judah</h1>
            <p>Herbal Center - {branch.name}</p>
            <p>{branch.location}</p>
            <p>Tel: +233 24 000 0000</p>
            <div className="border-t border-dashed my-2" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span>{Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          </div>
          <table className="w-full mb-6">
            <thead className="border-b border-dashed">
              <tr className="text-left">
                <th className="py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td className="py-1">{item.name}</td>
                  <td className="text-right py-1">{item.quantity}</td>
                  <td className="text-right py-1">₵{(item.retailPrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-1 border-t border-dashed pt-4 mb-8">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>₵{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CASH TENDERED:</span>
              <span>₵{amountTendered.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CHANGE:</span>
              <span>₵{change.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p>Thank you for choosing Nature's Remedy!</p>
            <p>Stay Healthy.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}