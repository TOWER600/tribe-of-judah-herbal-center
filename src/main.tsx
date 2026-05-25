import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import PosPage from '@/pages/PosPage'
import AdminDashboard from '@/pages/AdminDashboard'
import InventoryPage from '@/pages/InventoryPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PosLayout } from '@/components/layout/PosLayout'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pos",
    element: (
      <PosLayout>
        <PosPage />
      </PosLayout>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/inventory",
    element: (
      <AdminLayout>
        <InventoryPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <AdminLayout>
        <ReportsPage />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    ),
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)