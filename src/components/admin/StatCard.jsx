/* eslint-disable react/display-name */
import React from 'react';

export const StatCard = React.memo(({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="p-3 rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      </div>
    </div>
  </div>
));