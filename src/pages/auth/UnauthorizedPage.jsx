import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="space-y-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
