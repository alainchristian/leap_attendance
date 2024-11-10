import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../../layouts/DashboardLayout';

const ProtectedRoute = ({ 
    permission,
    permissions,
    requireAll = false,
    redirectTo = '/dashboard'
}) => {
    const { isAuthenticated, loading } = useAuth();
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <Navigate to={redirectTo} replace />;
    }

    if (permissions) {
        const hasPermissions = requireAll 
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
            
        if (!hasPermissions) {
            return <Navigate to={redirectTo} replace />;
        }
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export default ProtectedRoute;