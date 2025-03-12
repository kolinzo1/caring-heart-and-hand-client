export const adminService = {
    async getDashboardData(token) {
      try {
        // Check if server is available first
        const healthCheck = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        if (!healthCheck.ok) {
          throw new Error('Server unavailable');
        }
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          if (response.status === 503) {
            throw new Error('Service temporarily unavailable. Please try again later.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to server. Please check your connection.');
        }
        throw error;
      }
    }
  };