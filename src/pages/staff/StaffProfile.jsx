import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  GraduationCap,
  FileText,
  Lock,
  Upload,
  Save,
  Edit2,
} from "lucide-react";

const StaffProfile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    professionalInfo: {
      position: "",
      department: "",
      startDate: "",
      employeeId: "",
      certifications: [],
      qualifications: "",
      specializations: [],
    },
    documents: {
      profilePicture: null,
      certificationFiles: [],
      identificationFiles: [],
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      // const response = await api.get('/staff/profile');
      // setProfileData(response.data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // API call would go here
      // await api.put('/staff/profile', profileData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsEditing(false);
      addToast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update profile",
        variant: "error",
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast({
        title: "Error",
        description: "New passwords do not match",
        variant: "error",
      });
      return;
    }

    try {
      // API call would go here
      // await api.put('/staff/change-password', passwordForm);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      addToast({
        title: "Success",
        description: "Password changed successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to change password",
        variant: "error",
      });
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // API call would go here
      // const formData = new FormData();
      // formData.append('file', file);
      // await api.post(`/staff/upload/${type}`, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      addToast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to upload file",
        variant: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={
                    profileData.documents.profilePicture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "profilePicture")}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  value={profileData.personalInfo.firstName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        firstName: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  value={profileData.personalInfo.lastName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        lastName: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profileData.personalInfo.email}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      email: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                type="tel"
                value={profileData.personalInfo.phone}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      phone: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={profileData.personalInfo.address}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      address: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Emergency Contact</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Contact Name"
                  value={profileData.personalInfo.emergencyContact.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        emergencyContact: {
                          ...prev.personalInfo.emergencyContact,
                          name: e.target.value,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
                <Input
                  placeholder="Relationship"
                  value={profileData.personalInfo.emergencyContact.relationship}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        emergencyContact: {
                          ...prev.personalInfo.emergencyContact,
                          relationship: e.target.value,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
                <Input
                  placeholder="Phone Number"
                  value={profileData.personalInfo.emergencyContact.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        emergencyContact: {
                          ...prev.personalInfo.emergencyContact,
                          phone: e.target.value,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <Input
                value={profileData.professionalInfo.position}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    professionalInfo: {
                      ...prev.professionalInfo,
                      position: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <Input
                value={profileData.professionalInfo.department}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    professionalInfo: {
                      ...prev.professionalInfo,
                      department: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={profileData.professionalInfo.startDate}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    professionalInfo: {
                      ...prev.professionalInfo,
                      startDate: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee ID
              </label>
              <Input
                value={profileData.professionalInfo.employeeId}
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Qualifications
              </label>
              <Textarea
                value={profileData.professionalInfo.qualifications}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    professionalInfo: {
                      ...prev.professionalInfo,
                      qualifications: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Certifications
              </label>
              <div className="space-y-2">
                {profileData.professionalInfo.certifications.map(
                  (cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{cert}</span>
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newCerts = [
                              ...profileData.professionalInfo.certifications,
                            ];
                            newCerts.splice(index, 1);
                            setProfileData((prev) => ({
                              ...prev,
                              professionalInfo: {
                                ...prev.professionalInfo,
                                certifications: newCerts,
                              },
                            }));
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                )}
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const cert = window.prompt("Enter certification name:");
                      if (cert) {
                        setProfileData((prev) => ({
                          ...prev,
                          professionalInfo: {
                            ...prev.professionalInfo,
                            certifications: [
                              ...prev.professionalInfo.certifications,
                              cert,
                            ],
                          },
                        }));
                      }
                    }}
                  >
                    Add Certification
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Password Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                It's recommended to change your password periodically to
                maintain account security.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents and Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents & Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Certifications</h3>
              <div className="space-y-2">
                {profileData.documents.certificationFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <div className="mt-2">
                    <label className="block w-full">
                      <span className="sr-only">Upload Certification</span>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-white
                          hover:file:bg-primary/90"
                        onChange={(e) => handleFileUpload(e, "certification")}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Identification Documents</h3>
              <div className="space-y-2">
                {profileData.documents.identificationFiles.map(
                  (file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  )
                )}
                {isEditing && (
                  <div className="mt-2">
                    <label className="block w-full">
                      <span className="sr-only">Upload ID Document</span>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-white
                          hover:file:bg-primary/90"
                        onChange={(e) => handleFileUpload(e, "identification")}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffProfile;
