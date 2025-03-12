export const handleApiError = (error, addToast) => {
    console.error('API Error:', error);
    
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      message = error.response.data?.message || 'Server error';
    } else if (error.request) {
      message = 'Network error - please check your connection';
    }
  
    addToast({
      title: "Error",
      description: message,
      variant: "error",
    });
  
    return message;
  };
  
  export const handleAuthError = (error, navigate, addToast) => {
    if (error.response?.status === 401) {
      addToast({
        title: "Session Expired",
        description: "Please log in again",
        variant: "error",
      });
      navigate('/login');
    } else if (error.response?.status === 403) {
      addToast({
        title: "Access Denied",
        description: "You don't have permission to perform this action",
        variant: "error",
      });
      navigate('/dashboard');
    } else {
      handleApiError(error, addToast);
    }
  };