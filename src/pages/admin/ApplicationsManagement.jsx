import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { teamService } from "../../services/api/teamService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import {
  Eye,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const ApplicationsManagement = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const statuses = {
    pending: {
      label: "Pending Review",
      color: "bg-yellow-100 text-yellow-800",
    },
    reviewing: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
    interviewed: {
      label: "Interviewed",
      color: "bg-purple-100 text-purple-800",
    },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await teamService.getApplications();
      setApplications(data);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await teamService.updateApplicationStatus(applicationId, newStatus);
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      addToast({
        title: "Success",
        description: "Application status updated",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update status",
        variant: "error",
      });
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const downloadResume = async (id, fileName) => {
    try {
      const response = await teamService.downloadResume(id);
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to download resume",
        variant: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Status</option>
          {Object.entries(statuses).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {application.applicant.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{application.position}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {application.applicant.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {application.applicant.phone}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      statuses[application.status].color
                    }`}
                  >
                    {statuses[application.status].label}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadResume(application.id, application.resume)
                    }
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download Resume
                  </Button>
                </div>
                <Select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(application.id, e.target.value)
                  }
                  className="w-48"
                >
                  {Object.entries(statuses).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Details Modal would go here */}
    </div>
  );
};

export default ApplicationsManagement;
