import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import BookRoom from "./pages/BookRoom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Receptionist Pages
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import ManageRooms from "./pages/receptionist/ManageRooms";
import ManageBookings from "./pages/receptionist/ManageBookings";
import Alerts from "./pages/receptionist/Alerts";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AccessControl from "./pages/owner/AccessControl";
import Revenue from "./pages/owner/Revenue";
import AddRoom from "./pages/owner/AddRoom";
import Payments from "./pages/receptionist/Payments";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/book/:roomId" element={<BookRoom />} />
      <Route path="/login" element={<Login />} />

      {/* Receptionist Routes */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/rooms"
        element={
          <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
            <ManageRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/bookings"
        element={
          <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/payments"
        element={
          <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/alerts"
        element={
          <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
            <Alerts />
          </ProtectedRoute>
        }
      />

      {/* Owner Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/rooms"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ManageRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/bookings"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/guests"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/access-logs"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Alerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/alerts"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Alerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/revenue"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Revenue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/access-control"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AccessControl />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/add-room"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/payments"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Payments />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
