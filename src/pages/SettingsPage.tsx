import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Branch } from '@shared/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Store, Settings, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { BranchModal } from '@/components/settings/BranchModal';
export default function SettingsPage() {
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const { data: branches, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: () => api<Branch[]>('/api/branches')
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Control Panel</h1>
          <p className="text-muted-foreground mt-1">Configure your branches and system-wide preferences.</p>
        </div>
        <Tabs defaultValue="branches" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <TabsTrigger value="branches" className="rounded-lg px-6 py-2">
              <Building2 className="w-4 h-4 mr-2" /> Branches
            </TabsTrigger>
            <TabsTrigger value="general" className="rounded-lg px-6 py-2">
              <Settings className="w-4 h-4 mr-2" /> General Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="branches" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Locations</CardTitle>
                  <CardDescription>Manage your physical store branches and their operational details.</CardDescription>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={() => setIsBranchModalOpen(true)}>
                  <Plus className="w-4 h-4" /> Add Branch
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow>
                        <TableHead>Branch ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches?.map((branch) => (
                        <TableRow key={branch.id}>
                          <TableCell className="font-mono text-xs">{branch.id}</TableCell>
                          <TableCell className="font-bold">{branch.name}</TableCell>
                          <TableCell className="text-muted-foreground">{branch.location}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Modify</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>This information will appear on sales receipts and official reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entity Name</Label>
                      <Input defaultValue="Tribe of Judah Herbal Center" />
                    </div>
                    <div className="space-y-2">
                      <Label>Registration Number</Label>
                      <Input defaultValue="GH-POS-9982-2024" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Headquarters Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input className="pl-10" defaultValue="Main Street, Kasoa Bypass" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input className="pl-10" defaultValue="+233 24 555 0000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Public Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input className="pl-10" defaultValue="hello@tribeofjudah.com" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Save Configuration</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle>POS Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-2">
                     <Label>Default Pricing Mode</Label>
                     <Input disabled value="Retail (Standard)" />
                   </div>
                   <div className="space-y-2">
                     <Label>Currency Symbol</Label>
                     <Input defaultValue="₵" maxLength={1} />
                   </div>
                   <div className="space-y-2">
                     <Label>Tax Rate (%)</Label>
                     <Input type="number" defaultValue="5" />
                   </div>
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                     Changes affect new transactions only
                   </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BranchModal 
        open={isBranchModalOpen} 
        onOpenChange={setIsBranchModalOpen} 
        onSuccess={() => {
          refetch();
          setIsBranchModalOpen(false);
        }}
      />
    </div>
  );
}