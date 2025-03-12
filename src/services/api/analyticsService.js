export const analyticsService = {
    async getRevenueTrends(token, period = 'monthly') {
      const response = await fetch(`${API_URL}/api/admin/analytics/revenue?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    },
  
    async getStaffMetrics(token) {
      const response = await fetch(`${API_URL}/api/admin/analytics/staff`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    },
  
    async getClientRetention(token) {
      const response = await fetch(`${API_URL}/api/admin/analytics/retention`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    }
  };