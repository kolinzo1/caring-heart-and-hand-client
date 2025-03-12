import React, { useState } from 'react';
import { useToast } from "../hooks/useToast";
import { teamService } from "../services/api/teamService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// import { Label } from "./ui/Label";
import { Textarea } from "./ui/textarea";
import { AlertCircle, Loader2, CheckCircle2, Check } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx'];

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };
  
  const validatePhone = (phone) => {
    // Allow formats: (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    return null;
  };
  
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  
  const JobApplicationDialog = ({ 
    position = {},
    onSubmit = async () => {}, 
    trigger = <Button>Apply Now</Button> 
  }) => {
    const [open, setOpen] = useState(false);
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      cover_letter: '',
      resume: null
    });
    const [validationErrors, setValidationErrors] = useState({});
  
    const validateFile = (file) => {
      if (!file) return "Please select a file";
      if (file.size > MAX_FILE_SIZE) return "File size must be less than 5MB";
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(ext)) {
        return "Only PDF and Word documents are allowed";
      }
      return null;
    };
  
    const validateForm = () => {
      const errors = {};
      const emailError = validateEmail(formData.email);
      const phoneError = validatePhone(formData.phone);
      
      if (emailError) errors.email = emailError;
      if (phoneError) errors.phone = phoneError;
      if (!formData.first_name.trim()) errors.first_name = "First name is required";
      if (!formData.last_name.trim()) errors.last_name = "Last name is required";
      if (!formData.cover_letter.trim()) errors.cover_letter = "Cover letter is required";
      if (!formData.resume) errors.resume = "Resume is required";
  
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleInputChange = (e) => {
      const { name, value, files } = e.target;
      if (name === 'resume') {
        const file = files[0];
        const error = validateFile(file);
        if (error) {
          setValidationErrors(prev => ({ ...prev, resume: error }));
          return;
        }
        setValidationErrors(prev => ({ ...prev, resume: null }));
        setFormData(prev => ({
          ...prev,
          resume: file
        }));
      } else if (name === 'phone') {
        const formattedPhone = formatPhoneNumber(value);
        setFormData(prev => ({
          ...prev,
          [name]: formattedPhone
        }));
        const phoneError = validatePhone(formattedPhone);
        setValidationErrors(prev => ({
          ...prev,
          [name]: phoneError
        }));
      } else if (name === 'email') {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        const emailError = validateEmail(value);
        setValidationErrors(prev => ({
          ...prev,
          [name]: emailError
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        if (validationErrors[name]) {
          setValidationErrors(prev => ({
            ...prev,
            [name]: null
          }));
        }
      }
    };
  
    const resetForm = () => {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume: null
      });
      setError('');
      setSuccess(false);
      setApplicationId(null);
      setValidationErrors({});
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      try {
        const submitData = {
          ...formData,
          position_id: position.id
        };
  
        console.log('Submitting application:', submitData);
        const result = await teamService.submitApplication(submitData);
        
        setSuccess(true);
        setApplicationId(result.applicationId);
        
        // Show success message using your existing addToast
        addToast({
          title: "Success",
          description: "Application submitted successfully",
          variant: "success"
        });
  
        // Close dialog after delay
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 2000);
  
      } catch (err) {
        console.error('Submit error:', err);
        setError(err.message || 'Failed to submit application');
        
        addToast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>Apply for {position?.title || 'Position'}</DialogTitle>
            <DialogDescription>
              Please fill out the form below to apply for this position.
              {position?.department && ` - ${position.department}`}
            </DialogDescription>
          </DialogHeader>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
  
            {success && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md flex items-center gap-2">
                <Check className="h-4 w-4" />
                <p>Application submitted successfully! Application ID: {applicationId}</p>
              </div>
            )}
  
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first_name">First Name</label>
                <Input
                  id="first_name"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={validationErrors.first_name ? "border-red-500" : ""}
                />
                {validationErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <label htmlFor="last_name">Last Name</label>
                <Input
                  id="last_name"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={validationErrors.last_name ? "border-red-500" : ""}
                />
                {validationErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.last_name}</p>
                )}
              </div>
            </div>
  
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
  
            <div className="space-y-2">
              <label htmlFor="phone">Phone</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>
  
            <div className="space-y-2">
              <label htmlFor="resume">Resume</label>
              <div className="flex flex-col gap-1">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  required
                  onChange={handleInputChange}
                  className={`file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${
                    validationErrors.resume ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-gray-500">
                  Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX
                </span>
                {validationErrors.resume && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.resume}</p>
                )}
              </div>
            </div>
  
            <div className="space-y-2">
              <label htmlFor="cover_letter">Cover Letter</label>
              <Textarea
                id="cover_letter"
                name="cover_letter"
                required
                value={formData.cover_letter}
                onChange={handleInputChange}
                className={`min-h-[100px] ${validationErrors.cover_letter ? "border-red-500" : ""}`}
                placeholder="Tell us why you're interested in this position..."
              />
              {validationErrors.cover_letter && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.cover_letter}</p>
              )}
            </div>
  
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || success}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {success ? 'Submitted!' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default JobApplicationDialog;