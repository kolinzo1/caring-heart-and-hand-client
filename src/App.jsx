import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Notifications/toast";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from './components/error/ErrorBoundary';

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import CareRequestForm from "./pages/CareRequestForm";
import RequestConfirmationPage from "./pages/RequestConfirmationPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CareersPage from "./pages/CareersPage";

// Protected Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import JobPositionsManagement from "./pages/admin/JobPositionsManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import TimeLogsManagement from "./pages/admin/TimeLogsManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import ScheduleOverview from "./pages/admin/ScheduleOverview";
import StaffPerformance from "./pages/admin/StaffPerformance";
import CareRequestsManagement from "./pages/admin/CareRequestsManagement";


// Protected Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import TimeClockForm from "./pages/staff/TimeClockForm";
import ShiftHistory from "./pages/staff/ShiftHistory";
import StaffProfile from "./pages/staff/StaffProfile";
import ShiftReport from "./pages/staff/ShiftReport";

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
              <Route path="/request-care" element={<Layout><CareRequestForm /></Layout>} />
              <Route path="/request-confirmation" element={<Layout><RequestConfirmationPage /></Layout>} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
              <Route path="/careers" element={<Layout><CareersPage /></Layout>} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Layout>
                      <AdminLayout />
                    </Layout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="positions" element={<JobPositionsManagement />} />
                <Route path="applications" element={<ApplicationsManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="time-logs" element={<TimeLogsManagement />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="schedule" element={<ScheduleOverview />} />
                <Route path="performance" element={<StaffPerformance />} />
                <Route path="care-requests" element={<CareRequestsManagement />} />
              </Route>
              
              {/* Protected Staff Routes */}
              <Route
                path="/staff/*"
                element={
                  <ProtectedRoute roles={["staff"]}>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<StaffDashboard />} />
                        <Route path="/dashboard" element={<StaffDashboard />} />
                        <Route path="/time-clock" element={<TimeClockForm />} />
                        <Route path="/shift-history" element={<ShiftHistory />} />
                        <Route path="/shift-report/:shiftId" element={<ShiftReport />} />
                        <Route path="/profile" element={<StaffProfile />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;