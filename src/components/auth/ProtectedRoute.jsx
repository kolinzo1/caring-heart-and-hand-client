import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";
import { LoadingOverlay } from "../ui/LoadingStates/LoadingOverlay";

const ProtectedRoute = ({
  children,
  roles = [],
  permissions = [],
  redirectTo = "/login",
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay isLoading={true} />;
  }

  if (!isAuthenticated) {
    // Save the location they tried to access for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission-based access
  if (permissions.length > 0) {
    const hasRequiredPermission = permissions.some((permission) =>
      hasPermission(user.role, permission)
    );

    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
