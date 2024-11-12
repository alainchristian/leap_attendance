import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../common/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    
    // Log the error
    console.error('Application Error:', {
      error,
      errorInfo,
      stack: error.stack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-lg">
            <div className="mb-4">
              <div className="rounded-full bg-red-100 h-20 w-20 flex items-center justify-center mx-auto">
                <RefreshCw className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              className="w-full justify-center"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;