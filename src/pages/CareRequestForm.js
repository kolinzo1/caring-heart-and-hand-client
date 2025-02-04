import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import {
  Heart,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const CareRequestForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Care Details
    careType: "",
    startDate: "",
    frequency: "",
    preferredTime: "",

    // Care Recipient
    recipientName: "",
    recipientAge: "",
    recipientRelation: "",
    mobilityStatus: "",
    medicalConditions: "",

    // Additional Notes
    specificNeeds: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  const careTypes = [
    "Personal Care",
    "Companion Care",
    "Respite Care",
    "Post-Hospital Care",
  ];

  const frequencies = [
    "24/7 Care",
    "Daily Visit",
    "Weekly Visits",
    "Occasional Visits",
  ];

  const timeSlots = [
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Evening (4pm - 8pm)",
    "Night (8pm - 8am)",
    "Flexible",
  ];

  const mobilityOptions = [
    "Fully Independent",
    "Needs Some Assistance",
    "Wheelchair Dependent",
    "Bed-Bound",
  ];

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }
        if (!formData.phone) {
          newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
          newErrors.phone = "Invalid phone format";
        }
        break;
      case 2:
        if (!formData.careType) newErrors.careType = "Care type is required";
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.frequency) newErrors.frequency = "Frequency is required";
        break;
      case 3:
        if (!formData.recipientName)
          newErrors.recipientName = "Recipient name is required";
        if (!formData.recipientAge) {
          newErrors.recipientAge = "Age is required";
        } else if (
          isNaN(formData.recipientAge) ||
          formData.recipientAge < 0 ||
          formData.recipientAge > 120
        ) {
          newErrors.recipientAge = "Please enter a valid age";
        }
        if (!formData.mobilityStatus)
          newErrors.mobilityStatus = "Mobility status is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      try {
        // Here you would typically send the data to your backend
        // await submitFormData(formData);

        // Navigate to confirmation page with form data
        navigate("/request-confirmation", { state: { formData } });
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error appropriately
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="text-primary" />
              Request Care Services
            </CardTitle>
            <CardDescription>
              Tell us about your care needs and we'll help you find the right
              support.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {[
                  "Personal Info",
                  "Care Details",
                  "Recipient Info",
                  "Additional Info",
                ].map((label, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step > index + 1
                          ? "bg-green-500"
                          : step === index + 1
                          ? "bg-primary"
                          : "bg-gray-200"
                      } text-white`}
                    >
                      {step > index + 1 ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="ml-2 text-sm hidden md:block">
                      {label}
                    </span>
                    {index < 3 && (
                      <div className="w-full border-t border-gray-200 mx-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`pl-10 ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                          placeholder="Your first name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`pl-10 ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                          placeholder="Your last name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        placeholder="Your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Street address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        State
                      </label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ZIP Code
                      </label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="ZIP code"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Care Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type of Care Needed *
                    </label>
                    <Select
                      name="careType"
                      value={formData.careType}
                      onChange={handleChange}
                      className={errors.careType ? "border-red-500" : ""}
                    >
                      <option value="">Select care type</option>
                      {careTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                    {errors.careType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.careType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.startDate ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Care Frequency *
                    </label>
                    <Select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className={errors.frequency ? "border-red-500" : ""}
                    >
                      <option value="">Select frequency</option>
                      {frequencies.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </Select>
                    {errors.frequency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.frequency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="pl-10"
                      >
                        <option value="">Select preferred time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Recipient Information */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Care Recipient's Name *
                    </label>
                    <Input
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      className={errors.recipientName ? "border-red-500" : ""}
                      placeholder="Care recipient's name"
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Age *
                      </label>
                      <Input
                        type="number"
                        name="recipientAge"
                        value={formData.recipientAge}
                        onChange={handleChange}
                        className={errors.recipientAge ? "border-red-500" : ""}
                        placeholder="Age"
                      />
                      {errors.recipientAge && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.recipientAge}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Relationship to Recipient
                      </label>
                      <Input
                        name="recipientRelation"
                        value={formData.recipientRelation}
                        onChange={handleChange}
                        placeholder="e.g., Son, Daughter"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobility Status *
                    </label>
                    <Select
                      name="mobilityStatus"
                      value={formData.mobilityStatus}
                      onChange={handleChange}
                      className={errors.mobilityStatus ? "border-red-500" : ""}
                    >
                      <option value="">Select mobility status</option>
                      {mobilityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    {errors.mobilityStatus && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobilityStatus}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Medical Conditions
                    </label>
                    <Textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="Please list any relevant medical conditions..."
                      className="h-24"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Additional Information */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Specific Care Needs
                    </label>
                    <Textarea
                      name="specificNeeds"
                      value={formData.specificNeeds}
                      onChange={handleChange}
                      placeholder="Please describe any specific care needs..."
                      className="h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <Textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      placeholder="Any additional information you'd like to share..."
                      className="h-32"
                    />
                  </div>
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className={`flex items-center ${step === 1 ? "ml-auto" : ""}`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center"
              >
                Submit Request
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CareRequestForm;
