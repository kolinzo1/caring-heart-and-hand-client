import React from 'react';

export const ProfileSkeleton = () => (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );