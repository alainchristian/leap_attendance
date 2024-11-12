import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/auth/me');
      
      if (response.data.user) {
        console.log('User data received:', response.data.user); // Debug log
        setUser(response.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;

      console.log('Login successful:', { user }); // Debug log

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const hasPermission = useCallback((permission) => {
    console.log('Checking permission:', { permission, user }); // Debug log

    if (!user || !user.roles) {
      console.log('No user or roles found'); // Debug log
      return false;
    }

    const hasPermission = user.roles.some(role => {
      const roleHasPermission = role.permissions?.some(p => p.name === permission);
      console.log('Role check:', { 
        role: role.name, 
        permission, 
        hasPermission: roleHasPermission,
        permissions: role.permissions?.map(p => p.name)
      }); // Debug log
      return roleHasPermission;
    });

    return hasPermission;
  }, [user]);

  const hasAnyPermission = useCallback((permissions) => {
    console.log('Checking any permissions:', { permissions }); // Debug log
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions) => {
    console.log('Checking all permissions:', { permissions }); // Debug log
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  const isAdmin = useCallback(() => {
    return user?.roles?.some(role => role.name === 'Admin');
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;