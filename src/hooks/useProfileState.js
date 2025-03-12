import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { staffApiService } from '../services/staffApi';
import { useToast } from './useToast';

export const useProfileState = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await staffApiService.fetchProfile(token);
      setProfileData(data);
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch profile data",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      await staffApiService.updateProfile(token, profileData);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      addToast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "error",
      });
    }
  };

  const handleFieldUpdate = (section, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: value
    }));
    setHasUnsavedChanges(true);
  };

  return {
    isLoading,
    isEditing,
    setIsEditing,
    profileData,
    errors,
    hasUnsavedChanges,
    updateProfile,
    handleFieldUpdate,
  };
};