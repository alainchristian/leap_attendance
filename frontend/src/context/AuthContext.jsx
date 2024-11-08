// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored auth token and validate it
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         if (token) {
//           // In a real app, validate token with API
//           const userInfo = JSON.parse(localStorage.getItem('user_info'));
//           setUser(userInfo);
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user_info');
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (credentials) => {
//     // In a real app, make API call here
//     const mockUser = {
//       id: 1,
//       name: 'John Doe',
//       email: credentials.email,
//       role: 'admin',
//       avatar: '/api/placeholder/32/32',
//     };
//     const mockToken = 'mock_jwt_token';

//     // Store auth data
//     localStorage.setItem('auth_token', mockToken);
//     localStorage.setItem('user_info', JSON.stringify(mockUser));
//     setUser(mockUser);

//     return mockUser;
//   };

//   const logout = () => {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('user_info');
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user,
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
//       </div>
//     );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Dummy user data
const DUMMY_USERS = [
  {
    email: 'admin@asyv.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: '/api/placeholder/32/32'
  },
  {
    email: 'teacher@asyv.com',
    password: 'teacher123',
    name: 'Teacher User',
    role: 'teacher',
    avatar: '/api/placeholder/32/32'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-login for development (comment this out in production)
  useEffect(() => {
    setUser(DUMMY_USERS[0]); // Auto-login as admin
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const matchedUser = DUMMY_USERS.find(
        user => user.email === credentials.email && user.password === credentials.password
      );

      if (!matchedUser) {
        throw new Error('Invalid credentials');
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;