import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

export const PermissionGuard = ({ 
    children, 
    permission, 
    permissions, 
    requireAll = false,
    fallback = null 
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    if (permission && !hasPermission(permission)) {
        return fallback;
    }

    if (permissions) {
        const hasPermissions = requireAll 
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
            
        if (!hasPermissions) {
            return fallback;
        }
    }

    return children;
};

export default PermissionGuard;