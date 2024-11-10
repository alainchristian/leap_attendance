// src/components/auth/ProtectedLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import DashboardLayout from '../../layouts/DashboardLayout';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

const ProtectedLayout = ({ permission, permissions, requireAll = false }) => {
  const { 
    isAuthenticated, 
    loading, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for specific permission
  if (permission && !hasPermission(permission)) {
    console.log(`Access denied: Missing permission ${permission}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for multiple permissions
  if (permissions) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      console.log(`Access denied: Missing required permissions`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedLayout;