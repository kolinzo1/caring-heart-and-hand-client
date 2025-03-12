const BASE_URL = process.env.REACT_APP_API_URL;

export const staffApiService = {
  async fetchProfile(token) {
    const response = await fetch(`${BASE_URL}/api/staff/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }
    
    return response.json();
  },

  async updateProfile(token, profileData) {
    const response = await fetch(`${BASE_URL}/api/staff/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  async uploadFile(token, file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${BASE_URL}/api/staff/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    return response.json();
  },

  async changePassword(token, passwordData) {
    const response = await fetch(`${BASE_URL}/api/staff/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  }
};