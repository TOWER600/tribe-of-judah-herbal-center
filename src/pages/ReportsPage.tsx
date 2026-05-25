import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Sale } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Receipt, Calendar, CreditCard, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
export default function ReportsPage() {
  const { data: salesData, isLoading, refetch } = useQuery({
    queryKey: ['sales'],
    queryFn: () => api<{ items: Sale[] }>('/api/sales')
  });
  const sales = salesData?.items ?? [];
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalTransactions = sales.length;
  const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sales & Analytics</h1>
            <p className="text-muted-foreground mt-1">Detailed transaction history and performance metrics.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Total Revenue" value={`₵${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="emerald" />
          <KPICard title="Total Transactions" value={totalTransactions.toString()} icon={Receipt} color="blue" />
          <KPICard title="Avg. Sale Value" value={`₵${avgTicket.toFixed(2)}`} icon={ShoppingCart} color="indigo" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">Transaction History</h3>
            <Badge variant="outline" className="text-xs uppercase tracking-widest">Live Updates</Badge>
          </div>
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground animate-pulse">Loading transactions...</div>
            ) : sales.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground italic">No transactions recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sales.map((sale) => (
                  <div key={sale.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">Transaction #{sale.id.slice(0, 8).toUpperCase()}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase font-black">{sale.pricingMode}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(sale.timestamp, 'MMM dd, HH:mm')}</span>
                            <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 underline decoration-emerald-500/30">{sale.branchName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Amount</p>
                          <p className="text-xl font-black text-emerald-600">₵{sale.total.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                           <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none gap-1 dark:bg-blue-900/20 dark:text-blue-400">
                             <CreditCard className="w-3 h-3" /> {sale.paymentMethod.toUpperCase()}
                           </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pl-14 hidden group-hover:block animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 space-y-2 border border-slate-100 dark:border-slate-800">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{item.quantity}x {item.name}</span>
                            <span className="font-medium italic">₵{item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
function KPICard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
  };
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}