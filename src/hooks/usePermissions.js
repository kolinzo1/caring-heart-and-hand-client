import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export const usePermissions = () => {
  const { user } = useAuth();

  return {
    checkPermission: (permission) => hasPermission(user?.role, permission),
    hasAnyPermission: (permissions) =>
      permissions.some((permission) => hasPermission(user?.role, permission)),
    hasAllPermissions: (permissions) =>
      permissions.every((permission) => hasPermission(user?.role, permission)),
  };
};
