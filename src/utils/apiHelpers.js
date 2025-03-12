export const handleApiError = (error) => {
    if (error.response) {
      return {
        message: error.response.data.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "No response from server",
        status: 503,
      };
    } else {
      return {
        message: error.message || "An error occurred",
        status: 500,
      };
    }
  };
  
  export const handleResponse = async (response) => {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  };
  
  export const createHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  
  export const makeRequest = async (url, options = {}, token) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  };