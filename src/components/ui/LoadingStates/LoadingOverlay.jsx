import React from "react";
import { Spinner } from "./Spinner";

export const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
        <Spinner size="large" />
      </div>
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  );
};
