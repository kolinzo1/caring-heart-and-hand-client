import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Select } from "../../components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Briefcase,
  GraduationCap,
  Calendar,
} from "lucide-react";

const JobApplicationForm = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    education: "",
    experience: "",
    currentRole: "",
    startDate: "",
    resume: null,
    coverLetter: null,
    references: ["", "", ""],
    certifications: "",
    additionalInfo: "",
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "resume" || key === "coverLetter") {
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add position ID
      submitData.append("positionId", positionId);

      // API call would go here
      // const response = await fetch('/api/careers/apply', {
      //   method: 'POST',
      //   body: submitData
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        title: "Application Submitted",
        description:
          "Thank you for your application. We will review it and get back to you soon.",
        variant: "success",
      });

      navigate("/careers/application-confirmation");
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Job Application</CardTitle>
            <CardDescription>
              Please fill out all required fields marked with an asterisk (*).
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      ZIP
                    </label>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Professional Information
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Education *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Textarea
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="List your educational background"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Experience *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Describe your relevant work experience"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Role
                  </label>
                  <Input
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="Your current job title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Earliest Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Resume *
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, "resume")}
                      accept=".pdf,.doc,.docx"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Letter
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, "coverLetter")}
                      accept=".pdf,.doc,.docx"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certifications
                  </label>
                  <Textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="List any relevant certifications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional Information
                  </label>
                  <Textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like to share"
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default JobApplicationForm;
