import { handleResponse } from '../utils/apiHelpers';

const API_URL = process.env.REACT_APP_API_URL;

export const staffProfileApi = {
  async fetchProfile(token) {
    const response = await fetch(`${API_URL}/api/staff/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  async updateProfile(token, data) {
    const response = await fetch(`${API_URL}/api/staff/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async uploadFile(token, file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_URL}/api/staff/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  async changePassword(token, data) {
    const response = await fetch(`${API_URL}/api/staff/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
};