import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../redux/slices/authSlice';
import { useToast } from "../../hooks/useToast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Shield } from 'lucide-react';

export const SecuritySection = () => {
  const token = useSelector(selectCurrentToken);
  const { addToast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/staff/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      addToast({
        title: "Success",
        description: "Password changed successfully",
        variant: "success",
      });

      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          onClick={() => setShowPasswordDialog(true)}
        >
          Change Password
        </Button>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    currentPassword: e.target.value 
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    newPassword: e.target.value 
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    confirmPassword: e.target.value 
                  })}
                  required
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPasswordDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};