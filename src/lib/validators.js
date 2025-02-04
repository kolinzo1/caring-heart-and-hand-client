export const validators = {
  required: (value) => {
    if (!value) return "This field is required";
    return "";
  },
  email: (value) => {
    if (!value) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return "";
  },
  phone: (value) => {
    if (!value) return "";
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) return "Invalid phone number";
    return "";
  },
  minLength: (length) => (value) => {
    if (!value) return "";
    if (value.length < length) return `Must be at least ${length} characters`;
    return "";
  },
  maxLength: (length) => (value) => {
    if (!value) return "";
    if (value.length > length)
      return `Must be no more than ${length} characters`;
    return "";
  },
};
