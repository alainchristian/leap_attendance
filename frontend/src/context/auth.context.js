// src/context/auth.context.js
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ROLE_PERMISSIONS, PERMISSIONS } from '../utils/permissions';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem('@ASYVAuth:token');
        if (storedToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          console.log('Auth State Loaded:', {
            user: response.data.user.email,
            roles: response.data.user.roles?.map(r => r.name),
            permissions: response.data.user.roles?.flatMap(r => 
              ROLE_PERMISSIONS[r.name] || []
            )
          });
        }
      } catch (error) {
        console.error('Auth Load Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.message);
        localStorage.removeItem('@ASYVAuth:token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;

      localStorage.setItem('@ASYVAuth:token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data.user;
      setUser(userData);

      console.log('Login Successful:', {
        user: userData.email,
        roles: userData.roles?.map(r => r.name),
        permissions: userData.roles?.flatMap(r => ROLE_PERMISSIONS[r.name] || [])
      });
      
      return true;
    } catch (error) {
      console.error('Login Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      localStorage.removeItem('@ASYVAuth:token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setError(null);
    }
  };

  const getUserRoles = () => {
    return user?.roles?.map(role => role.name) || [];
  };

  const hasRole = (roleName) => {
    return getUserRoles().includes(roleName);
  };

  const isAdmin = () => hasRole('Admin');

  const hasPermission = (permission) => {
    if (!permission) return true;
    
    const userRoles = getUserRoles();
    if (!userRoles.length) {
      console.log('No roles found for user:', user?.email);
      return false;
    }

    // Admin has all permissions
    if (userRoles.includes('Admin')) {
      console.log('Admin access granted:', {
        user: user?.email,
        permission
      });
      return true;
    }

    // Check permissions from all roles
    const hasRequiredPermission = userRoles.some(roleName => {
      const rolePermissions = ROLE_PERMISSIONS[roleName] || [];
      return rolePermissions.includes(permission);
    });

    console.log('Permission Check:', {
      permission,
      user: user?.email,
      roles: userRoles,
      result: hasRequiredPermission,
      availablePermissions: userRoles.flatMap(role => ROLE_PERMISSIONS[role] || [])
    });

    return hasRequiredPermission;
  };

  const hasAnyPermission = (permissions) => {
    if (isAdmin()) return true;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    if (isAdmin()) return true;
    return permissions.every(permission => hasPermission(permission));
  };

  // Get all permissions for the current user
  const getUserPermissions = () => {
    return getUserRoles().flatMap(role => ROLE_PERMISSIONS[role] || []);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRoles,
    getUserPermissions,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;