import React from 'react';
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FileUpload } from "../ui/FileUpload";

export const PersonalInfoSection = ({
  data,
  isEditing,
  onUpdate,
  onFileUpload,
  errors
}) => {
  const handleChange = (field, value) => {
    onUpdate('personalInfo', { ...data, [field]: value });
  };

  const handleEmergencyContactChange = (field, value) => {
    onUpdate('personalInfo', {
      ...data,
      emergencyContact: { ...data.emergencyContact, [field]: value }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <FileUpload
            currentFile={data.profilePicture}
            onFileSelect={(file) => onFileUpload(file, 'profilePicture')}
            acceptedTypes={['.jpg', '.jpeg', '.png']}
            label="Upload Profile Picture"
            maxSize={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={!isEditing}
              error={errors?.firstName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={!isEditing}
              error={errors?.lastName}
            />
          </div>
        </div>

        {/* Email field */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
            error={errors?.email}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Phone field */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            error={errors?.phone}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* Address field */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Textarea
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={!isEditing}
            error={errors?.address}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Emergency Contact section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-4">Emergency Contact</h3>
          <div className="space-y-4">
            <Input
              placeholder="Contact Name"
              value={data.emergencyContact?.name}
              onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              disabled={!isEditing}
              error={errors?.emergencyContactName}
            />
            <Input
              placeholder="Relationship"
              value={data.emergencyContact?.relationship}
              onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
              disabled={!isEditing}
              error={errors?.emergencyContactRelationship}
            />
            <Input
              placeholder="Phone Number"
              value={data.emergencyContact?.phone}
              onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
              disabled={!isEditing}
              error={errors?.emergencyContactPhone}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};