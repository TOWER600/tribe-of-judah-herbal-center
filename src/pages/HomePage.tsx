import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
      <ThemeToggle />
      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-emerald-100 p-4 rounded-full dark:bg-emerald-900/30">
            <Leaf className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white font-display">
            Tribe of Judah <br />
            <span className="text-emerald-600">Herbal Center</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto">
            Management & Point of Sale System
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <Button 
            variant="outline" 
            className="h-auto p-8 flex flex-col items-center space-y-4 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group"
            onClick={() => navigate('/pos')}
          >
            <div className="p-4 bg-emerald-100 rounded-2xl dark:bg-emerald-900/30 group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Cashier Terminal</h2>
              <p className="text-sm text-slate-500">Sales, Billing & Inventory</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-8 flex flex-col items-center space-y-4 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
            onClick={() => navigate('/admin')}
          >
            <div className="p-4 bg-indigo-100 rounded-2xl dark:bg-indigo-900/30 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Super Admin</h2>
              <p className="text-sm text-slate-500">Reports, Staff & Settings</p>
            </div>
          </Button>
        </div>
        <footer className="pt-12 text-slate-400 text-sm">
          © {new Date().getFullYear()} Tribe of Judah Herbal Center. All rights reserved.
        </footer>
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}