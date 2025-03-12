import React from 'react';
import { Briefcase, Calendar, Award, GraduationCap, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export const ProfessionalInfoSection = ({
  data,
  isEditing,
  onUpdate,
  errors
}) => {
  const handleChange = (field, value) => {
    onUpdate('professionalInfo', { ...data, [field]: value });
  };

  const handleCertificationAdd = (cert) => {
    handleChange('certifications', [...data.certifications, cert]);
  };

  const handleCertificationRemove = (index) => {
    const newCerts = [...data.certifications];
    newCerts.splice(index, 1);
    handleChange('certifications', newCerts);
  };

  return (
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
            value={data.position}
            onChange={(e) => handleChange('position', e.target.value)}
            disabled={!isEditing}
            error={errors?.position}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <Input
            value={data.department}
            onChange={(e) => handleChange('department', e.target.value)}
            disabled={!isEditing}
            error={errors?.department}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            disabled={!isEditing}
            error={errors?.startDate}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <Input
            value={data.employeeId}
            disabled={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Qualifications</label>
          <Textarea
            value={data.qualifications}
            onChange={(e) => handleChange('qualifications', e.target.value)}
            disabled={!isEditing}
            error={errors?.qualifications}
            icon={<GraduationCap className="w-4 h-4" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Certifications</label>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>{cert}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleCertificationRemove(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  const cert = window.prompt("Enter certification name:");
                  if (cert) handleCertificationAdd(cert);
                }}
                className="w-full"
              >
                Add Certification
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};