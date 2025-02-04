import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
        <LoadingSpinner />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default LoadingOverlay;