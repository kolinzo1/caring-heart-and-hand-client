import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  FileText,
  LogOut,
  User,
  Settings,
  Bell,
  UserPlus,
  ClipboardList,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStaff: 15,
    totalClients: 45,
    activeShifts: 8,
    pendingRequests: 3,
  });

  const [recentRequests, setRecentRequests] = useState([
    {
      id: 1,
      clientName: "Sarah Williams",
      serviceType: "Personal Care",
      status: "Pending",
      date: "2024-02-01",
    },
    {
      id: 2,
      clientName: "Michael Brown",
      serviceType: "Companion Care",
      status: "Approved",
      date: "2024-02-01",
    },
  ]);

  const handleLogout = () => {
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
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <p style={{ margin: 0, color: "#666" }}>Welcome back</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/admin/notifications")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                backgroundColor: "#EF4444",
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              3
            </span>
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
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

      {/* Stats Grid */}
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
            <Users color="#3B82F6" />
            <h3>Total Staff</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.totalStaff}
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
            <User color="#10B981" />
            <h3>Total Clients</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.totalClients}
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
            <Clock color="#6366F1" />
            <h3>Active Shifts</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.activeShifts}
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
            <ClipboardList color="#F59E0B" />
            <h3>Pending Requests</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {stats.pendingRequests}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/admin/staff/new")}
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
            <UserPlus size={16} />
            Add Staff
          </button>
          <button
            onClick={() => navigate("/admin/clients/new")}
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
            <User size={16} />
            Add Client
          </button>
          <button
            onClick={() => navigate("/admin/schedule")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6366F1",
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
            View Schedule
          </button>
        </div>
      </div>

      {/* Recent Care Requests */}
      <div>
        <h2 style={{ marginBottom: "20px" }}>Recent Care Requests</h2>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {recentRequests.map((request) => (
            <div
              key={request.id}
              style={{
                padding: "20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{request.clientName}</h3>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  {request.serviceType}
                </p>
                <p style={{ margin: 0, color: "#666" }}>{request.date}</p>
              </div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    backgroundColor:
                      request.status === "Approved" ? "#D1FAE5" : "#FEF3C7",
                    color:
                      request.status === "Approved" ? "#059669" : "#D97706",
                  }}
                >
                  {request.status}
                </span>
                <button
                  onClick={() => navigate(`/admin/requests/${request.id}`)}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
