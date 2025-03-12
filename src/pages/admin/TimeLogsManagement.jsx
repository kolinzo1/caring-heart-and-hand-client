import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import DataTable from '../../components/ui/DataTable';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Clock,
  Search,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';

const TimeLogsManagement = () => {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    staffId: '',
    clientId: '',
    status: 'all'
  });

  useEffect(() => {
    fetchTimeLogs();
  }, [dateRange, filters, currentPage]);

  const fetchTimeLogs = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        page: currentPage,
        limit: 10,
        ...(filters.staffId && { staffId: filters.staffId }),
        ...(filters.clientId && { clientId: filters.clientId }),
        ...(filters.status !== 'all' && { status: filters.status })
      });
  
      // Update the endpoint path to match the backend route
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/time-logs/admin?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) throw new Error('Failed to fetch time logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching time logs:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch time logs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/time-logs/admin/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'approved' })
        }
      );
  
      if (!response.ok) throw new Error('Failed to approve time log');
  
      addToast({
        title: "Success",
        description: "Time log approved",
        variant: "success"
      });
  
      fetchTimeLogs();
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/time-logs/admin/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'rejected' })
        }
      );
  
      if (!response.ok) throw new Error('Failed to reject time log');
  
      addToast({
        title: "Success",
        description: "Time log rejected",
        variant: "success"
      });
  
      fetchTimeLogs();
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      key: 'staff_name',
      header: 'Staff',
      sortable: true,
    },
    {
      key: 'client_name',
      header: 'Client',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      key: 'duration',
      header: 'Duration',
      sortable: true,
      render: (row) => formatDuration(row.start_time, row.end_time),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            row.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : row.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        row.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-green-600"
              onClick={() => handleApprove(row.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600"
              onClick={() => handleReject(row.id)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )
      ),
    },
  ];

  const formatDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Time Logs Management</h1>
        <Button /* onClick={exportToCSV} */ className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({
                    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  });
                  setFilters({
                    staffId: '',
                    clientId: '',
                    status: 'all'
                  });
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={logs}
            isLoading={isLoading}
            searchable
            onSearch={setSearchTerm}
            pageSize={10}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            serverSide
            totalRows={logs.length}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeLogsManagement;