import React from 'react';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validatePassword } from "../../utils/validators";

export const PasswordChangeDialog = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword(formData.newPassword, formData.confirmPassword);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};