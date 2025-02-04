import React from "react";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

const RequirePermission = ({ children, permission, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, permission)) {
    return fallback;
  }

  return children;
};

export default RequirePermission;
