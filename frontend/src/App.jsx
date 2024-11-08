// // import React from 'react';
// // import { AuthProvider, useAuth } from './context/AuthContext';
// // import DashboardLayout from './layouts/DashboardLayout';
// // import LoginPage from './pages/auth/Login';
// // import Dashboard from './pages/dashboard/Dashboard';

// // const AppContent = () => {
// //   const { isAuthenticated, login } = useAuth();

// //   const handleLogin = async (credentials) => {
// //     try {
// //       await login(credentials);
// //     } catch (error) {
// //       console.error('Login failed:', error);
// //     }
// //   };

// //   if (!isAuthenticated) {
// //     return <LoginPage onLogin={handleLogin} />;
// //   }

// //   return (
// //     <DashboardLayout>
// //       <Dashboard />
// //     </DashboardLayout>
// //   );
// // };

// // const App = () => {
// //   return (
// //     <AuthProvider>
// //       <AppContent />
// //     </AuthProvider>
// //   );
// // };

// // export default App;
// import React from 'react'

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold text-gray-900">
//         ASYV LEAP is working!
//       </h1>
//     </div>
//   )
// }

// export default App
import React, { Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const { isAuthenticated, login, loading } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Let the login component handle the error
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;