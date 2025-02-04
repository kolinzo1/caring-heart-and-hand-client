// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
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
import { Switch } from "../../components/ui/switch";
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Globe,
  Upload,
  Save,
} from "lucide-react";

const AdminSettings = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    general: {
      companyName: "",
      websiteUrl: "",
      contactEmail: "",
      phone: "",
      address: "",
    },
    notifications: {
      newApplications: true,
      applicationStatusChanges: true,
      newMessages: true,
      staffUpdates: true,
    },
    email: {
      senderName: "",
      senderEmail: "",
      emailSignature: "",
      autoResponder: false,
    },
    security: {
      requireTwoFactor: false,
      sessionTimeout: "30",
      passwordExpiration: "90",
      minimumPasswordLength: "8",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      // const response = await api.get('/admin/settings');
      // setSettings(response.data);

      // Simulated API response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (section, data) => {
    try {
      // API call would go here
      // await api.put(`/admin/settings/${section}`, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSettings((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));

      addToast({
        title: "Success",
        description: "Settings saved successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to save settings",
        variant: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <Input
                value={settings.general.companyName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, companyName: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Website URL
              </label>
              <Input
                type="url"
                value={settings.general.websiteUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, websiteUrl: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, contactEmail: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                type="tel"
                value={settings.general.phone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, phone: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={settings.general.address}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, address: e.target.value },
                  }))
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSaveSettings("general", settings.general)}
              className="ml-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Applications</p>
                <p className="text-sm text-gray-500">
                  Receive notifications for new job applications
                </p>
              </div>
              <Switch
                checked={settings.notifications.newApplications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      newApplications: checked,
                    },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Application Status Changes</p>
                <p className="text-sm text-gray-500">
                  Notifications when application statuses are updated
                </p>
              </div>
              <Switch
                checked={settings.notifications.applicationStatusChanges}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      applicationStatusChanges: checked,
                    },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Messages</p>
                <p className="text-sm text-gray-500">
                  Get notified for new messages and inquiries
                </p>
              </div>
              <Switch
                checked={settings.notifications.newMessages}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      newMessages: checked,
                    },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Staff Updates</p>
                <p className="text-sm text-gray-500">
                  Notifications about staff changes and updates
                </p>
              </div>
              <Switch
                checked={settings.notifications.staffUpdates}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      staffUpdates: checked,
                    },
                  }))
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                handleSaveSettings("notifications", settings.notifications)
              }
              className="ml-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Configure email communication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Sender Name
              </label>
              <Input
                value={settings.email.senderName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, senderName: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Sender Email
              </label>
              <Input
                type="email"
                value={settings.email.senderEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, senderEmail: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Signature
              </label>
              <Textarea
                value={settings.email.emailSignature}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, emailSignature: e.target.value },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Responder</p>
                <p className="text-sm text-gray-500">
                  Send automatic responses to new inquiries
                </p>
              </div>
              <Switch
                checked={settings.email.autoResponder}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, autoResponder: checked },
                  }))
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSaveSettings("email", settings.email)}
              className="ml-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <Switch
                checked={settings.security.requireTwoFactor}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: { ...prev.security, requireTwoFactor: checked },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      sessionTimeout: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password Expiration (days)
              </label>
              <Input
                type="number"
                value={settings.security.passwordExpiration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      passwordExpiration: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Password Length
              </label>
              <Input
                type="number"
                value={settings.security.minimumPasswordLength}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      minimumPasswordLength: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSaveSettings("security", settings.security)}
              className="ml-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
