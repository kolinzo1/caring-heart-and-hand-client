export const validateAdminInput = {
    settings: (data) => {
      const errors = {};
      
      if (!data.companyName?.trim()) {
        errors.companyName = 'Company name is required';
      }
  
      if (!data.contactEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.contactEmail = 'Valid email is required';
      }
  
      if (!data.phone?.match(/^\+?[\d\s-]{10,}$/)) {
        errors.phone = 'Valid phone number is required';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },
  
    staffMember: (data) => {
      const errors = {};
      
      if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = 'Valid email is required';
      }
  
      if (!data.role || !['admin', 'staff'].includes(data.role)) {
        errors.role = 'Valid role is required';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  };