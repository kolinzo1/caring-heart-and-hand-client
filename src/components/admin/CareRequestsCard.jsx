import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card';
const CareRequestsCard = ({ requests, onStatusChange }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Care Requests
            </div>
            <StatusFilter />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{request.clientName}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(request.submittedAt)}
                    </p>
                  </div>
                  <RequestStatusBadge 
                    status={request.status} 
                    onStatusChange={(status) => onStatusChange(request.id, status)}
                  />
                </div>
                <RequestDetails request={request} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };