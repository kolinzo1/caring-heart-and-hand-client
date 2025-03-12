import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/api/adminService";
import { StatCard } from "../../components/admin/StatCard";
import { DashboardSkeleton } from "../../components/admin/DashboardSkeleton";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Users, 
  User, 
  FileText, 
  DollarSign, 
  Calendar,
  ChevronRight,
  Activity,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering');
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 0,
      totalStaff: 0,
      activeRequests: 0,
      totalRevenue: 0
    }
  });

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        console.log('API URL:', process.env.REACT_APP_API_URL);
        console.log('Token:', token);
        
        setIsLoading(true);
        setError(null);
        const data = await adminService.getDashboardData(token);
        console.log('Dashboard data received:', data);
        
        if (data && data.stats) {
          console.log('Setting dashboard data:', data.stats);
          setDashboardData(data);
        } else {
          console.log('Invalid data format received:', data);
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [token, navigate]);

  if (isLoading) {
    console.log('Showing loading skeleton');
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="Total Clients"
            value={stats.totalClients || 0}
          />
          <StatCard
            icon={<User className="w-8 h-8 text-green-500" />}
            title="Total Staff"
            value={stats.totalStaff || 0}
          />
          <StatCard
            icon={<FileText className="w-8 h-8 text-purple-500" />}
            title="Active Requests"
            value={stats.activeRequests || 0}
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8 text-yellow-500" />}
            title="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toFixed(2)}`}
          />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Schedule Overview Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Schedule Overview
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Manage staff schedules and appointments
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/schedule')}
                >
                  View Schedule
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Staff Performance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Staff Performance
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Monitor staff metrics and performance
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/performance')}
                >
                  View Performance
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Time Logs Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Time Logs
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Review and manage staff time logs
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/time-logs')}
                >
                  View Time Logs
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;