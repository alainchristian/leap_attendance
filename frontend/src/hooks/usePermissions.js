import { useAuth } from '../context/auth.context';
import { 
    hasPermission, 
    hasRole, 
    hasAnyPermission, 
    hasAllPermissions 
} from '../utils/permissions';

export const usePermissions = () => {
    const { user } = useAuth();

    return {
        hasPermission: (permission) => hasPermission(user, permission),
        hasRole: (role) => hasRole(user, role),
        hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
        hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
        permissions: user?.roles?.flatMap(role => role.permissions?.map(p => p.name)) || [],
        roles: user?.roles?.map(role => role.name) || []
    };
};

export default usePermissions;