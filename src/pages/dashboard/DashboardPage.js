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
import {
  Clock,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock4,
} from "lucide-react";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({
    totalHours: 0,
    clientsServed: 0,
    upcomingShifts: 0,
    pendingReports: 0,
  });
  const [recentClients, setRecentClients] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/staff/dashboard", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setStats(data.stats);
      setRecentClients(data.recentClients);
      setUpcomingShifts(data.upcomingShifts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.firstName}!</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Hours
                  </p>
                  <h3 className="text-2xl font-bold">{stats.totalHours}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Clients Served
                  </p>
                  <h3 className="text-2xl font-bold">{stats.clientsServed}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Upcoming Shifts
                  </p>
                  <h3 className="text-2xl font-bold">{stats.upcomingShifts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reports
                  </p>
                  <h3 className="text-2xl font-bold">{stats.pendingReports}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Shifts
              </CardTitle>
              <CardDescription>
                Your scheduled shifts for the next few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingShifts.map((shift, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Clock4 className="w-4 h-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{shift.clientName}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(shift.startTime)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Clients
              </CardTitle>
              <CardDescription>
                Clients you've recently provided care for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600">
                        Last visit: {formatDate(client.lastVisit)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {client.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <Clock className="w-6 h-6 mb-2" />
              Log Time
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <FileText className="w-6 h-6 mb-2" />
              Submit Report
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <Calendar className="w-6 h-6 mb-2" />
              View Schedule
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <Users className="w-6 h-6 mb-2" />
              Client List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
