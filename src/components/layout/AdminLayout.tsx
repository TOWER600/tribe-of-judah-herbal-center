import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Package, BarChart3, Settings, LogOut, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
export function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r border-slate-200 dark:border-slate-800">
        <SidebarHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarMenu className="space-y-1">
              {[
                { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
                { icon: Package, label: "Inventory", path: "/admin/inventory" },
                { icon: BarChart3, label: "Reports", path: "/admin/reports" },
                { icon: Settings, label: "Settings", path: "/admin/settings" },
              ].map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    className="w-full justify-start gap-3 py-6 px-4 rounded-xl"
                  >
                    <Link to={item.path}>
                      <item.icon className="size-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-slate-500 hover:text-red-600">
                <Link to="/">
                  <LogOut className="size-5" />
                  <span>Exit to Gateway</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-slate-50 dark:bg-slate-950">
        <header className="h-16 flex items-center px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <SidebarTrigger />
          <div className="ml-4 h-4 w-px bg-slate-200 dark:bg-slate-800 mr-4" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {location.pathname === '/admin' ? 'Overview' : location.pathname.split('/').pop()}
          </h2>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}