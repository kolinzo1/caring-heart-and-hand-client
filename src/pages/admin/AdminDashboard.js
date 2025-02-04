import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card.js";
import { Button } from "../../components/ui/button.js";
import { Input } from "../../components/ui/input.js";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../../components/ui/select.js";
import {
  Users,
  Clock,
  FileText,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  BarChart,
  CheckCircle,
  XCircle,
  Settings,
  Filter,
} from "lucide-react";

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalStaff: 0,
    activeRequests: 0,
    totalRevenue: 0,
  });

  const [careRequests, setCareRequests] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setStats(data.stats);
      setCareRequests(data.careRequests);
      setStaffMembers(data.staffMembers);
      setClients(data.clients);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await fetch(`/api/care-requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clients
                  </p>
                  <h3 className="text-2xl font-bold">{stats.totalClients}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Staff
                  </p>
                  <h3 className="text-2xl font-bold">{stats.totalStaff}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Requests
                  </p>
                  <h3 className="text-2xl font-bold">{stats.activeRequests}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold">
                    {formatCurrency(stats.totalRevenue)}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Care Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Care Requests
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careRequests
                  .filter(
                    (request) =>
                      filterStatus === "all" || request.status === filterStatus
                  )
                  .map((request, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{request.clientName}</h4>
                          <p className="text-sm text-gray-600">
                            Submitted: {formatDate(request.submitDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                          <Select
                            value={request.status}
                            onValueChange={(value) =>
                              handleStatusChange(request.id, value)
                            }
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approve</SelectItem>
                              <SelectItem value="rejected">Reject</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Care Type:</span>{" "}
                        {request.careType}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Start Date:</span>{" "}
                        {formatDate(request.startDate)}
                      </p>
                    </div>
                  ))}

                {careRequests.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No care requests found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Staff Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Staff Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers.map((staff, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{staff.name}</h4>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {staff.activeClients} Active Clients
                      </p>
                      <p className="text-sm text-gray-600">
                        {staff.hoursThisMonth} hrs this month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities Log */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add activity log items here */}
              <div className="text-sm text-gray-600">
                Activity log will be displayed here...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
