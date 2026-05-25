import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import { MOCK_SALES_STATS, MOCK_PRODUCTS } from '@shared/mock-data';
export default function AdminDashboard() {
  const lowStockItems = MOCK_PRODUCTS.filter(p => p.totalStock < 10);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Today's Revenue" value="₵4,250" icon={TrendingUp} trend="+12.5%" color="emerald" />
          <StatsCard title="Total Transactions" value="158" icon={Users} trend="+4.2%" color="blue" />
          <StatsCard title="Active Inventory" value="1,240" icon={Package} color="amber" />
          <StatsCard title="Low Stock Alerts" value={lowStockItems.length.toString()} icon={AlertTriangle} color="red" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Branch Sales Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SALES_STATS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="kasoa" name="Kasoa" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="kaneshie" name="Kaneshie" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Stock Alerts</CardTitle>
              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Critical</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">Stock: <span className="text-red-500 font-bold">{item.totalStock} {item.unit}s</span></p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase">Reorder</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function StatsCard({ title, value, icon: Icon, trend, color }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}