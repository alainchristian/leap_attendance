
// src/config/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import UsersList from '../components/users/UsersList';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Element, requiredPermission }) => {
    const { user, hasPermission } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Element />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {/* Dashboard Route */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<ProtectedRoute element={() => <div>Dashboard Content</div>} />} />

                {/* Users Management Routes */}
                <Route
                    path="users"
                    element={
                        <ProtectedRoute
                            element={UsersList}
                            requiredPermission="view users"
                        />
                    }
                />

                {/* Add more routes here */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;