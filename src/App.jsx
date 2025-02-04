import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Notifications/toast"; // Make sure you have this component
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from './components/error/ErrorBoundary';


// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Protected Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import TimeClockForm from "./pages/staff/TimeClockForm";
import ShiftHistory from "./pages/staff/ShiftHistory";
import StaffProfile from "./pages/staff/StaffProfile";

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <AboutPage />
                  </Layout>
                }
              />
              <Route
                path="/services"
                element={
                  <Layout>
                    <ServicesPage />
                  </Layout>
                }
              />
              <Route
                path="/contact"
                element={
                  <Layout>
                    <ContactPage />
                  </Layout>
                }
              />
              <Route
                path="/blog"
                element={
                  <Layout>
                    <BlogPage />
                  </Layout>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />

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
