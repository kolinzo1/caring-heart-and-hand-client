export const validatePassword = (password, confirmPassword) => {
    const errors = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters`);
    if (!hasUpperCase) errors.push('Password must contain an uppercase letter');
    if (!hasLowerCase) errors.push('Password must contain a lowercase letter');
    if (!hasNumbers) errors.push('Password must contain a number');
    if (!hasSpecialChar) errors.push('Password must contain a special character');
    if (password !== confirmPassword) errors.push('Passwords do not match');
  
    return errors;
  };
  
  export const validateFile = (file, maxSize = 5, acceptedTypes) => {
    const errors = [];
    const maxSizeInBytes = maxSize * 1024 * 1024; // Convert MB to bytes
  
    if (file.size > maxSizeInBytes) {
      errors.push(`File size must be less than ${maxSize}MB`);
    }
  
    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
    }
  
    return errors;
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  export const validateProfileData = (data) => {
    const errors = {};
  
    // Personal Info Validation
    if (!data.personalInfo?.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
  
    if (!data.personalInfo?.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
  
    if (!validateEmail(data.personalInfo?.email)) {
      errors.email = "Please enter a valid email address";
    }
  
    if (!validatePhone(data.personalInfo?.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
  
    return errors;
  };