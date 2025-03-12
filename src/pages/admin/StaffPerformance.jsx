import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

const StaffPerformance = () => {
  const { addToast } = useToast();
  const [metrics, setMetrics] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [detailedMetrics, setDetailedMetrics] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/staff/metrics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch staff metrics',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaffDetails = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/staff/metrics/${userId}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch staff details');
      const data = await response.json();
      setDetailedMetrics(data);
      setSelectedStaff(metrics.find(s => s.id === userId));
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch staff details',
        variant: 'error'
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Performance</h1>
        <div className="flex gap-4">
          <Select
            value={dateRange.startDate}
            onValueChange={(value) => setDateRange({ ...dateRange, startDate: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Start Date" />
            </SelectTrigger>
            <SelectContent>
              {/* Add date options */}
            </SelectContent>
          </Select>
          <Select
            value={dateRange.endDate}
            onValueChange={(value) => setDateRange({ ...dateRange, endDate: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="End Date" />
            </SelectTrigger>
            <SelectContent>
              {/* Add date options */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Active Staff</p>
                <h3 className="text-2xl font-bold">{metrics.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Add more overview cards */}
      </div>

      {/* Staff Performance Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Staff Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Clients Served</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Approved Shifts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    {staff.first_name} {staff.last_name}
                  </TableCell>
                  <TableCell>{staff.hours_worked}</TableCell>
                  <TableCell>{staff.unique_clients}</TableCell>
                  <TableCell>{staff.attendance_rate}%</TableCell>
                  <TableCell>
                    {staff.approved_shifts}/{staff.total_shifts}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchStaffDetails(staff.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Staff Details Modal or Section */}
      {selectedStaff && detailedMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedStaff.first_name} {selectedStaff.last_name}'s Performance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Monthly Performance Chart */}
            <div className="h-[400px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailedMetrics.monthlyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hours_worked" name="Hours Worked" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="unique_clients" name="Unique Clients" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Service Type Distribution</h3>
                {/* Add service type chart */}
              </div>
              <div>
                <h3 className="font-semibold mb-4">Client Feedback</h3>
                {/* Add client feedback summary */}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffPerformance;