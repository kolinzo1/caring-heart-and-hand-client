import React from "react";
import { cn } from "../../../utils/cn";

export const FormField = ({
  label,
  error,
  required,
  className = "",
  children,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
