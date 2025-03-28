import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { FileText, Search, Filter, RefreshCw } from "lucide-react";
import CareRequestDetails from "../../components/admin/CareRequestDetails";
import { useToast } from "../../hooks/useToast";

const CareRequestsManagement = () => {
  const { token } = useAuth();
  const [careRequests, setCareRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  // Fetch care requests
  const fetchCareRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/care-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCareRequests(data);
    } catch (err) {
      console.error("Error fetching care requests:", err);
      setError("Failed to load care requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCareRequests();
    }
  }, [token]);

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort the data
  const filteredAndSortedRequests = React.useMemo(() => {
    let filtered = [...careRequests];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.first_name?.toLowerCase().includes(query) ||
          request.last_name?.toLowerCase().includes(query) ||
          request.email?.toLowerCase().includes(query) ||
          request.care_type?.toLowerCase().includes(query) ||
          request.recipient_name?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    return filtered;
  }, [careRequests, statusFilter, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);
  const paginatedRequests = filteredAndSortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-500">In Progress</Badge>;
      case "assigned":
        return <Badge className="bg-purple-500">Assigned</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      console.log(`Updating request ${requestId} to status: ${newStatus}`);

      const API_URL = process.env.REACT_APP_API_URL;
      const endpoint = `${API_URL}/api/care-requests/${requestId}/status`;
    
      console.log("Sending request to:", endpoint);

      const response = await fetch(`${API_URL}/api/care-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      console.log("Response status:", response.status);
    
      if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response:", errorData);
      throw new Error(`Failed to update status: ${response.status} ${errorData.message || ''}`);
      }
    
    const data = await response.json();
    console.log("Success response:", data);
      
      // Update the request status in the local state
      setCareRequests(careRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));

      // Show success notification if you have a toast system
      alert("Status updated successfully");
      
      return true;
    } catch (error) {
      console.error("Failed to update status:", error);
      
      // Show error notification
      addToast?.({
        title: "Update Failed",
        description: "Failed to update request status",
        variant: "error"
      });
      
      throw error;
    }
  };

  // Add this function to view request details
  const handleViewRequest = (requestId) => {
    const request = careRequests.find(req => req.id === requestId);
    if (request) {
      setSelectedRequest(request);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">{error}</p>
        <Button onClick={fetchCareRequests} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Care Requests Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Filter:</span>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 w-full md:w-64"
                placeholder="Search care requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {paginatedRequests.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => requestSort("created_at")}
                      >
                        Date
                        {sortConfig.key === "created_at" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => requestSort("last_name")}
                      >
                        Requester
                        {sortConfig.key === "last_name" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => requestSort("care_type")}
                      >
                        Care Type
                        {sortConfig.key === "care_type" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => requestSort("status")}
                      >
                        Status
                        {sortConfig.key === "status" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {formatDate(request.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {request.first_name} {request.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{request.recipient_name}</div>
                          <div className="text-sm text-gray-500">
                            Age: {request.recipient_age}
                          </div>
                        </TableCell>
                        <TableCell>{request.care_type}</TableCell>
                        <TableCell>{formatDate(request.start_date)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-normal"
                            onClick={() => handleViewRequest(request.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis for skipped pages
                        if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex rounded-full bg-gray-100 p-4 mb-4">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No care requests found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "There are no care requests to display at this time."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  fetchCareRequests();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Request Details Modal/Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg">
            <CareRequestDetails 
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              onStatusChange={handleStatusUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CareRequestsManagement;