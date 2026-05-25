import React, { useEffect } from 'react';
import { LogOut, User, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { usePosStore } from '@/stores/usePosStore';
export function PosLayout({ children }: { children: React.ReactNode }) {
  const currentBranch = usePosStore(s => s.currentBranch);
  const pricingMode = usePosStore(s => s.pricingMode);
  const togglePricingMode = usePosStore(s => s.togglePricingMode);
  const setBranchById = usePosStore(s => s.setBranchById);
  useEffect(() => {
    const savedBranchId = localStorage.getItem('branch_id');
    if (savedBranchId) {
      setBranchById(savedBranchId);
    }
  }, [setBranchById]);
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">TOJ POS</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{currentBranch.name}</span>
            </div>
            <Badge
              variant={pricingMode === 'wholesale' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={togglePricingMode}
            >
              {pricingMode.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium">Cashier #01</span>
          </div>
          <Button variant="ghost" size="icon" asChild className="text-slate-500 hover:text-red-600">
            <Link to="/">
              <LogOut className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}