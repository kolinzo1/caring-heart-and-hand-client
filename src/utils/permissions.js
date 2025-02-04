export const PERMISSIONS = {
  ADMIN: [
    "manage_staff",
    "manage_clients",
    "view_reports",
    "manage_settings",
    "manage_schedules",
  ],
  STAFF: [
    "view_schedule",
    "log_time",
    "view_clients",
    "submit_reports",
    "update_profile",
  ],
};

export const hasPermission = (userRole, permission) => {
  const rolePermissions = PERMISSIONS[userRole?.toUpperCase()];
  return rolePermissions?.includes(permission) || false;
};
