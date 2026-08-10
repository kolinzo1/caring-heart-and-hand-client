import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApplicantAuth } from "../../context/ApplicantAuthContext";
import { LoadingOverlay } from "../ui/LoadingStates/LoadingOverlay";

const ApplicantProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApplicantAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay isLoading={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ApplicantProtectedRoute;
