import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import ContactPage from "../pages/ContactPage";
import BlogPage from "../pages/BlogPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute roles={["staff"]}>
              <Layout>
                <StaffDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Public Routes with layout */}
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
      </Routes>
    </Router>
  );
};

export default App;
