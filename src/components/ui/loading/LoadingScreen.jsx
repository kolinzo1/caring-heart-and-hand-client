import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" className="mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;