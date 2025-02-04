import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [userData, setUserData] = useState({
    name: "John Doe",
    role: "Staff",
    assignedClients: 5,
    todayShifts: 2,
    pendingReports: 3,
  });

  const [recentShifts, setRecentShifts] = useState([
    {
      id: 1,
      clientName: "Alice Johnson",
      date: "2024-02-01",
      time: "09:00 AM - 11:00 AM",
      status: "Completed",
    },
    {
      id: 2,
      clientName: "Bob Smith",
      date: "2024-02-01",
      time: "02:00 PM - 04:00 PM",
      status: "Upcoming",
    },
  ]);

  const handleLogout = () => {
    // Clear local storage/session
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Top Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <User />
          <div>
            <h2 style={{ margin: 0 }}>{userData.name}</h2>
            <p style={{ margin: 0, color: "#666" }}>{userData.role}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/staff/settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 16px",
              backgroundColor: "#EF4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <User color="#3B82F6" />
            <h3>Assigned Clients</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {userData.assignedClients}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <Calendar color="#10B981" />
            <h3>Today's Shifts</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {userData.todayShifts}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <FileText color="#6366F1" />
            <h3>Pending Reports</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {userData.pendingReports}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/staff/time-log")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Clock size={16} />
            Log Time
          </button>
          <button
            onClick={() => navigate("/staff/reports")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FileText size={16} />
            Submit Report
          </button>
        </div>
      </div>

      {/* Recent Shifts */}
      <div>
        <h2 style={{ marginBottom: "20px" }}>Recent Shifts</h2>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {recentShifts.map((shift) => (
            <div
              key={shift.id}
              style={{
                padding: "20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{shift.clientName}</h3>
                <p style={{ margin: "5px 0", color: "#666" }}>{shift.date}</p>
                <p style={{ margin: 0, color: "#666" }}>{shift.time}</p>
              </div>
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "4px",
                  backgroundColor:
                    shift.status === "Completed" ? "#D1FAE5" : "#FEF3C7",
                  color: shift.status === "Completed" ? "#059669" : "#D97706",
                }}
              >
                {shift.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
