import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Clock,
  Calendar,
  FileText,
  LogOut,
  User,
  Settings,
} from "lucide-react";


const StaffDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    assignedClients: 0,
    todayShifts: 0,
    pendingReports: 0
  });
  const [recentShifts, setRecentShifts] = useState([]);

  const handleTimeLog = () => {
    console.log('Navigating to /staff/time-clock');
    navigate('/staff/time-clock');
  };
  
  
  const handleSubmitReport = (shiftId) => {
    console.log('Navigating to shift report with ID:', shiftId);
    navigate(`/staff/shift-report/${shiftId}`);
  };
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    fetchRecentShifts();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/staff/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRecentShifts = async () => {
    try {
      console.log('Fetching recent shifts...');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-logs/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received shifts:', data);
      setRecentShifts(data);
    } catch (error) {
      console.error('Error fetching recent shifts:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center p-5 bg-white rounded-lg mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <User className="w-10 h-10 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Welcome Back</h2>
            <p className="text-gray-600">Staff Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/staff/settings')}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <User className="text-blue-500" />
            <h3 className="font-medium">Assigned Clients</h3>
          </div>
          <p className="text-2xl font-bold">{dashboardData.assignedClients}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-green-500" />
            <h3 className="font-medium">Today's Shifts</h3>
          </div>
          <p className="text-2xl font-bold">{dashboardData.todayShifts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-indigo-500" />
            <h3 className="font-medium">Pending Reports</h3>
          </div>
          <p className="text-2xl font-bold">{dashboardData.pendingReports}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button onClick={handleTimeLog}>Log Time</Button>
          <Button onClick={() => navigate('/staff/shift-history')}>View All Shifts</Button>
          {/* Show shifts needing reports */}
          {recentShifts.filter(shift => !shift.hasReport).map(shift => (
            <Button 
              key={shift.id} 
              onClick={() => handleSubmitReport(shift.id)}
            >
              Submit Report for {shift.clientName}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Shifts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Shifts</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {recentShifts.map((shift, index) => (
          <div
            key={shift.id}
            className={`p-4 ${
              index !== recentShifts.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{`${shift.first_name} ${shift.last_name}`}</h3>
                <p className="text-gray-600">{new Date(shift.date).toLocaleDateString()}</p>
                <p className="text-gray-600">{shift.start_time} - {shift.end_time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Completed
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/staff/shift-report/${shift.id}`)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        ))}
          {recentShifts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No recent shifts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;