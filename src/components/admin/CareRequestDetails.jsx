import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Mail, Phone, Calendar, User, Clock, FileText } from "lucide-react";

const CareRequestDetails = ({ request, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(request.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      new: "bg-blue-500 text-white",
      in_progress: "bg-orange-500 text-white",
      assigned: "bg-purple-500 text-white",
      completed: "bg-green-500 text-white",
      canceled: "bg-red-500 text-white",
    };
    const colorClass = statusColors[status] || "bg-gray-500 text-white";
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
        {status === "in_progress" ? "In Progress" : 
         status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      await onStatusChange(request.id, status);
      // Status update handled by parent component
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Care Request Details</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Status:</span>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Requester Info */}
        <div className="border-b pb-4">
          <h3 className="font-medium text-lg mb-3">Requester Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">Name</span>
              </div>
              <p className="font-medium">{request.first_name} {request.last_name}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">Email</span>
              </div>
              <p className="font-medium">{request.email}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">Phone</span>
              </div>
              <p className="font-medium">{request.phone}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Request Date</span>
              </div>
              <p className="font-medium">{formatDate(request.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Care Recipient Info */}
        <div className="border-b pb-4">
          <h3 className="font-medium text-lg mb-3">Care Recipient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">Name</span>
              </div>
              <p className="font-medium">{request.recipient_name}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <span className="text-sm ml-6">Age</span>
              </div>
              <p className="font-medium">{request.recipient_age}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <span className="text-sm ml-6">Relationship</span>
              </div>
              <p className="font-medium">{request.recipient_relation || "Not specified"}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <span className="text-sm ml-6">Mobility Status</span>
              </div>
              <p className="font-medium">{request.mobility_status}</p>
            </div>
          </div>
        </div>

        {/* Care Details */}
        <div className="border-b pb-4">
          <h3 className="font-medium text-lg mb-3">Care Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-sm">Care Type</span>
              </div>
              <p className="font-medium">{request.care_type}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Start Date</span>
              </div>
              <p className="font-medium">{formatDate(request.start_date)}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Frequency</span>
              </div>
              <p className="font-medium">{request.frequency}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Preferred Time</span>
              </div>
              <p className="font-medium">{request.preferred_time || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(request.medical_conditions || request.specific_needs || request.additional_notes) && (
          <div>
            <h3 className="font-medium text-lg mb-3">Additional Information</h3>
            
            {request.medical_conditions && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Medical Conditions</h4>
                <p className="text-gray-600 whitespace-pre-line">{request.medical_conditions}</p>
              </div>
            )}
            
            {request.specific_needs && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Specific Care Needs</h4>
                <p className="text-gray-600 whitespace-pre-line">{request.specific_needs}</p>
              </div>
            )}
            
            {request.additional_notes && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Additional Notes</h4>
                <p className="text-gray-600 whitespace-pre-line">{request.additional_notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Update Status:</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleUpdateStatus} 
            disabled={isUpdating || status === request.status}
            size="sm"
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </div>
        <Button onClick={onClose} variant="outline">Close</Button>
      </CardFooter>
    </Card>
  );
};

export default CareRequestDetails;