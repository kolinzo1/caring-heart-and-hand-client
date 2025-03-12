export const validateProfileData = (data) => {
    const errors = {};
  
    // Personal Info Validation
    if (!data.personalInfo.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
  
    if (!data.personalInfo.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
  
    if (!data.personalInfo.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Please enter a valid email address";
    }
  
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!data.personalInfo.phone?.match(phoneRegex)) {
      errors.phone = "Please enter a valid phone number";
    }
  
    // Emergency Contact Validation
    if (data.personalInfo.emergencyContact) {
      if (!data.personalInfo.emergencyContact.name?.trim()) {
        errors.emergencyContactName = "Emergency contact name is required";
      }
      if (!data.personalInfo.emergencyContact.phone?.match(phoneRegex)) {
        errors.emergencyContactPhone = "Please enter a valid emergency contact phone number";
      }
    }
  
    // Professional Info Validation
    if (!data.professionalInfo.position?.trim()) {
      errors.position = "Position is required";
    }
  
    if (!data.professionalInfo.startDate) {
      errors.startDate = "Start date is required";
    }
  
    return errors;
  };
  
  export const validateFile = (file, type) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (file.size > maxSize) {
      errors.push("File size must be less than 5MB");
    }
  
    const allowedTypes = {
      profilePicture: ['image/jpeg', 'image/png'],
      certification: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      identification: ['application/pdf', 'image/jpeg', 'image/png']
    };
  
    if (!allowedTypes[type]?.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${allowedTypes[type].map(t => t.split('/')[1]).join(', ')}`);
    }
  
    return errors;
  };
  
  export const validatePassword = (password, confirmPassword) => {
    const errors = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters`);
    }
    if (!hasUpperCase) errors.push('Password must contain an uppercase letter');
    if (!hasLowerCase) errors.push('Password must contain a lowercase letter');
    if (!hasNumbers) errors.push('Password must contain a number');
    if (!hasSpecialChar) errors.push('Password must contain a special character');
    if (password !== confirmPassword) errors.push('Passwords do not match');
  
    return errors;
  };