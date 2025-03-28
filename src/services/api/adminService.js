/* Utility function for making authenticated API requests
 * @param {string} endpoint - API endpoint path
 * @param {string} token - Authentication token
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - API response
 */
const authenticatedFetch = async (endpoint, token, options = {}) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    if (!API_URL) {
      throw new Error('API URL is not configured');
    }

    if (!token) {
      token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token available');
      }
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Auth error, clear token
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export const adminService = {
  async getDashboardData(token) {
    try {
      console.log("Getting dashboard data with token:", token ? "Token exists" : "No token");
      return await authenticatedFetch('/api/admin/dashboard', token);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      throw error;
    }
  },
  
  async getStaffList(token) {
    try {
      return await authenticatedFetch('/api/admin/team', token);
    } catch (error) {
      console.error("Staff list fetch error:", error);
      throw error;
    }
  },
  
  async getCareRequests(token) {
    try {
      return await authenticatedFetch('/api/care-requests', token);
    } catch (error) {
      console.error("Care requests fetch error:", error);
      throw error;
    }
  },
  
  async updateCareRequestStatus(requestId, status, token) {
    try {
      return await authenticatedFetch(`/api/care-requests/${requestId}/status`, token, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error("Update care request status error:", error);
      throw error;
    }
  }
};

export default adminService;