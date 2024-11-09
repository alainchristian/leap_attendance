import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/settings/index';


// Lazy load settings pages using dynamic import
//const Users = React.lazy(() => import('./pages/settings/index'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <Routes>
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

      <Route
        path="/"
        element={<ProtectedRoute />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="dashboard" 
          element={<Dashboard />} 
        />
        
        <Route
          path="settings/users"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Users />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;


// import React, { Suspense } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import DashboardLayout from './layouts/DashboardLayout';
// import LoginPage from './pages/auth/Login';
// import Dashboard from './pages/dashboard/Dashboard';
// import Users from './pages/settings/Users';

// // Loading component
// const LoadingSpinner = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
//   </div>
// );

// const ProtectedLayout = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <DashboardLayout>
//       <Outlet />
//     </DashboardLayout>
//   );
// };

// const AppContent = () => {
//   const { isAuthenticated, login } = useAuth();

//   const handleLogin = async (credentials) => {
//     try {
//       await login(credentials);
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={
//           !isAuthenticated ? (
//             <LoginPage onLogin={handleLogin} />
//           ) : (
//             <Navigate to="/dashboard" replace />
//           )
//         }
//       />

//       {/* Protected Routes */}
//       <Route element={<ProtectedLayout />}>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
        
//         {/* Settings Routes */}
//         <Route path="/settings">
//           <Route
//             path="users"
//             element={
//               <Suspense fallback={<LoadingSpinner />}>
//                 <Users />
//               </Suspense>
//             }
//           />
//         </Route>
//       </Route>

//       {/* Catch all */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppContent />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;