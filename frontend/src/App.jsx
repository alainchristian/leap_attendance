// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/auth.context';
// import AppRoutes from './config/routes';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('App Error:', {
//       error,
//       errorInfo,
//       stack: error.stack
//     });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-red-50">
//           <div className="text-center p-8">
//             <h1 className="text-2xl font-bold text-red-600 mb-4">
//               Something went wrong
//             </h1>
//             <pre className="text-sm text-red-500 bg-white p-4 rounded-lg overflow-auto max-w-lg">
//               {this.state.error?.toString()}
//             </pre>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               Reload Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// const App = () => {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <BrowserRouter future={{ v7_startTransition: true }}>
//           <AppRoutes />
//         </BrowserRouter>
//       </AuthProvider>
//     </ErrorBoundary>
//   );
// };

// export default App;
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import AppRoutes from './config/routes';
import ErrorBoundary from './components/error/ErrorBoundary';

// Loading component - reuse existing
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;