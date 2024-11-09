import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = useCallback(async (credentials) => {
    return context.login(credentials);
  }, [context]);

  const logout = useCallback(() => {
    context.logout();
  }, [context]);

  const hasPermission = useCallback((permission) => {
    if (!context.user) return false;
    return context.user.roles.some(role => 
      role.permissions?.some(p => p.name === permission)
    );
  }, [context.user]);

  const hasRole = useCallback((role) => {
    if (!context.user) return false;
    return context.user.roles.includes(role);
  }, [context.user]);

  return {
    user: context.user,
    token: context.token,
    isAuthenticated: !!context.token,
    loading: context.loading,
    login,
    logout,
    hasPermission,
    hasRole
  };
};

export default useAuth;