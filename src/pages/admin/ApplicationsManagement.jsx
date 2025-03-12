import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { teamService } from "../../services/api/teamService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import DataTable from '../../components/ui/DataTable';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
  Loader,
} from "lucide-react";

const ApplicationsManagement = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const statuses = {
    pending: {
      label: "Pending Review",
      color: "bg-yellow-100 text-yellow-800",
    },
    reviewing: { 
      label: "Under Review", 
      color: "bg-blue-100 text-blue-800" 
    },
    interviewed: {
      label: "Interviewed",
      color: "bg-purple-100 text-purple-800",
    },
    accepted: { 
      label: "Accepted", 
      color: "bg-green-100 text-green-800" 
    },
    rejected: { 
      label: "Rejected", 
      color: "bg-red-100 text-red-800" 
    },
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching applications...');
      const data = await teamService.getApplications();
      console.log('Received applications:', data);
      
      // Validate and transform data if needed
      const validatedData = data.map(app => ({
        ...app,
        status: app.status || 'pending',
        created_at: app.created_at || new Date().toISOString(),
        first_name: app.first_name || 'Unknown',
        last_name: app.last_name || 'Applicant',
      }));
  
      setApplications(validatedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch applications",
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
    if (!app) return false;  // Guard against undefined entries
    
    const matchesSearch = searchTerm === '' || 
      (app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.position?.toLowerCase().includes(searchTerm.toLowerCase()));
       
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const [downloadingResumes, setDownloadingResumes] = useState(new Set());

  const handleDownloadResume = async (id, resumeUrl) => {
    if (!resumeUrl) {
      addToast({
        title: "Error",
        description: "No resume file available",
        variant: "error"
      });
      return;
    }
  
    setDownloadingResumes(prev => new Set([...prev, id]));
    
    try {
      console.log('Downloading resume for id:', id);
      const response = await teamService.downloadResume(id);
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${id}.pdf`; // Default filename
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      addToast({
        title: "Success",
        description: "Resume downloaded successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Download error:', error);
      addToast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "error"
      });
    } finally {
      setDownloadingResumes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  
  const columns = [
    {
      key: 'applicant',
      header: 'Applicant',
      sortable: true,
      render: (row) => row.first_name && row.last_name ? 
        `${row.first_name} ${row.last_name}` : 'N/A'
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
      render: (row) => row.position_title || `Position ${row.position_id}`
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div className="flex flex-col space-y-1">
          {row.email && (
            <span className="flex items-center text-sm text-gray-500">
              <Mail className="w-4 h-4 mr-1" />
              {row.email}
            </span>
          )}
          {row.phone && (
            <span className="flex items-center text-sm text-gray-500">
              <Phone className="w-4 h-4 mr-1" />
              {row.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Submitted',
      sortable: true,
      render: (row) => {
        try {
          return new Date(row.created_at).toLocaleDateString();
        } catch (e) {
          return 'Invalid Date';
        }
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          statuses[row.status]?.color || statuses['pending'].color
        }`}>
          {statuses[row.status]?.label || 'Pending Review'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedApplication(row)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadResume(row.id, row.resume_url)}
            disabled={!row.resume_url || downloadingResumes.has(row.id)}
          >
            {downloadingResumes.has(row.id) ? (
              <Loader className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            Resume
          </Button>
          <Select
            value={row.status || 'pending'}
            onValueChange={(value) => handleStatusChange(row.id, value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statuses).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredApplications}
            isLoading={isLoading}
            searchable
            onSearch={setSearchTerm}
            pageSize={10}
          />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
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
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statuses).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.first_name} {application.last_name}
                  </TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {application.email}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {application.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${statuses[application.status]?.color}`}>
                      {statuses[application.status]?.label || 'Pending Review'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadResume(application.id, application.resume_url)}
                        disabled={!application.resume_url || downloadingResumes.has(application.id)}
                      >
                        {downloadingResumes.has(application.id) ? (
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-1" />
                        )}
                        Resume
                      </Button>
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statuses).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Details Modal would go here */}
    </div>
  );
};

export default ApplicationsManagement;
