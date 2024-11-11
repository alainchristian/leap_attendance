// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth.context';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UnauthorizedPage from './pages/error/Unauthorized';
import { PERMISSIONS } from './utils/permissions';
import Users from './pages/settings';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

// Enhanced Protected Layout Component with Debug Logging
const ProtectedLayout = ({ permission, permissions, requireAll = false }) => {
  const { 
    isAuthenticated, 
    loading, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    user 
  } = useAuth();

  // Debug logging
  const logPermissionCheck = (type, permissionToCheck, result) => {
    console.log(`Permission Check [${type}]:`, {
      user: user?.email,
      roles: user?.roles?.map(r => r.name),
      permissionRequired: permissionToCheck,
      hasAccess: result,
      userPermissions: user?.roles?.flatMap(r => r.permissions?.map(p => p.name) || [])
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('Access denied: Not authenticated');
    return <Navigate to="/login" replace />;
  }

  // Check specific permission with debug logging
  if (permission) {
    const hasAccess = hasPermission(permission);
    logPermissionCheck('Single', permission, hasAccess);
    
    if (!hasAccess) {
      console.log(`Access denied: Missing permission ${permission}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check multiple permissions with debug logging
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    logPermissionCheck(
      requireAll ? 'All Required' : 'Any Required',
      permissions,
      hasAccess
    );

    if (!hasAccess) {
      console.log('Access denied: Missing required permissions', permissions);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

// Routes Component with Enhanced Error Handling
const AppRoutes = () => {
  const { isAuthenticated, login, user } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      console.log('Login attempt:', {
        success: result,
        user: user?.email,
        roles: user?.roles?.map(r => r.name)
      });
      return result;
    } catch (error) {
      console.error('Login failed:', {
        error: error.message,
        details: error.response?.data
      });
      throw error;
    }
  };

  // Debug current auth state
  console.log('Current auth state:', {
    isAuthenticated,
    user: user?.email,
    roles: user?.roles?.map(r => r.name),
    permissions: user?.roles?.flatMap(r => r.permissions?.map(p => p.name) || [])
  });

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
          element={
            <ProtectedLayout 
              permission={PERMISSIONS.USER_VIEW}
              // Optional: Add more granular permissions if needed
              permissions={[PERMISSIONS.USER_VIEW, PERMISSIONS.USER_EDIT]}
              requireAll={false}
            />
          }
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

// App Component with Error Boundary
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', {
      error,
      errorInfo,
      stack: error.stack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <pre className="text-sm text-red-500 bg-white p-4 rounded-lg overflow-auto max-w-lg">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;