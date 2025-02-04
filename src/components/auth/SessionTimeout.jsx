import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
const CHECK_INTERVAL = 60 * 1000; // Check every minute

const SessionTimeout = () => {
  const { user, refreshToken, logout } = useAuth();
  const { addToast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const expiryTime = user.exp * 1000; // Convert to milliseconds
      const timeUntilExpiry = expiryTime - Date.now();

      if (timeUntilExpiry <= SESSION_WARNING_TIME) {
        setTimeLeft(Math.floor(timeUntilExpiry / 1000));
        setShowWarning(true);
      }
    };

    const intervalId = setInterval(checkSession, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleExtendSession = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
      addToast({
        title: "Session Extended",
        description: "Your session has been successfully extended.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Session Extension Failed",
        description: "Please log in again to continue.",
        variant: "error",
      });
      logout();
    }
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };

  if (!showWarning) return null;

  return (
    <Dialog open={showWarning} onClose={() => {}}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Session Expiring</h2>
        <p className="mb-4">
          Your session will expire in {Math.floor(timeLeft / 60)} minutes and{" "}
          {timeLeft % 60} seconds. Would you like to extend your session?
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleExtendSession}>Extend Session</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SessionTimeout;
