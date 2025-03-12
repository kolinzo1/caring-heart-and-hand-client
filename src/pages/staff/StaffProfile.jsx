import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { PersonalInfoSection } from "../../components/staff/PersonalInfoSection";
import { ProfessionalInfoSection } from "../../components/staff/ProfessionalInfoSection";
import { SecuritySection } from "../../components/staff/SecuritySection";
import { useProfileState } from "../../hooks/useProfileState";
import { ProfileSkeleton } from "../../components/staff/LoadingStates";

const StaffProfile = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    isEditing,
    setIsEditing,
    profileData,
    errors,
    hasUnsavedChanges,
    updateProfile,
    handleFieldUpdate,
    handleFileUpload,
    handlePasswordChange,
  } = useProfileState();

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile();
      setShowConfirmDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profileData) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (hasUnsavedChanges) {
                    setShowConfirmDialog(true);
                  } else {
                    setIsEditing(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowConfirmDialog(true)}
                disabled={!hasUnsavedChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoSection
          data={profileData.personalInfo}
          isEditing={isEditing}
          onUpdate={handleFieldUpdate}
          onFileUpload={handleFileUpload}
          errors={errors.personalInfo}
        />

        <ProfessionalInfoSection
          data={profileData.professionalInfo}
          isEditing={isEditing}
          onUpdate={handleFieldUpdate}
          errors={errors.professionalInfo}
        />

        <SecuritySection
          onPasswordChange={handlePasswordChange}
        />

        {/* Certifications and Documents Section would go here */}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Are you sure you want to save these changes to your profile?"
        confirmText="Save Changes"
        isLoading={isSaving}
      />
    </div>
  );
};

export default StaffProfile;