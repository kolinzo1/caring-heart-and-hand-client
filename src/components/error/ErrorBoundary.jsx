import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Something Went Wrong
                </h2>
                <p className="text-gray-600 mb-6">
                  An unexpected error has occurred. Our team has been notified.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Refresh Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleReset}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;