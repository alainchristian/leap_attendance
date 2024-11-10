import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth.context';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UnauthorizedPage from './pages/error/Unauthorized';
import { PERMISSIONS } from './utils/permissions';

// Lazy loaded components
const Users = React.lazy(() => import('./pages/settings/index'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

// Protected Layout Component
const ProtectedLayout = ({ permission, permissions, requireAll = false }) => {
  const { isAuthenticated, loading, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Settings Routes */}
        <Route 
          element={<ProtectedLayout permission={PERMISSIONS.USER_VIEW} />}
        >
          <Route
            path="/settings/users"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Users />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;