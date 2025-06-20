import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import MapViewPage from "./pages/MapViewPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import NewReportPage from "./pages/NewReportPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import MunicipalityDashboardPage from './pages/admin/MunicipalityDashboardPage';
import ManageContractorsPage from "./pages/admin/ManageContractorsPage";
import CorporateDashboardPage from "./pages/admin/CorporateDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<Index />} />
              <Route path="map" element={<MapViewPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="report/new" element={<NewReportPage />} />
              <Route path="report/:id" element={<ReportDetailPage />} />
              <Route path="admin/users" element={<ManageUsersPage />} />
              <Route path="admin/dashboard" element={<MunicipalityDashboardPage />} />
              <Route path="admin/corporate-dashboard" element={<CorporateDashboardPage />} />
              <Route path="admin/manage-contractors" element={<ManageContractorsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
