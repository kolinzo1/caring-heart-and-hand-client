import api from "../../lib/axios";

export const teamService = {
  // Team Members
  async getTeamMembers() {
    const response = await api.get("/team");
    return response.data;
  },

  async getTeamMember(id) {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },

  async createTeamMember(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    });

    const response = await api.post("/team", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateTeamMember(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    });

    const response = await api.put(`/team/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteTeamMember(id) {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },

  // Job Applications
  async submitApplication(data) {
    try {
      const formData = new FormData();
      
      // Add all text fields
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('cover_letter', data.cover_letter);
      formData.append('position_id', data.position_id);
      
      // Add the resume file
      if (data.resume) {
        formData.append('resume', data.resume);
      }
  
      console.log('Submitting application:', Object.fromEntries(formData));
  
      const response = await api.post("/api/careers/apply", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  },

  async getApplications(filters = {}) {
    const response = await api.get("/api/careers/applications", {
      params: filters,
  });
  return response.data;
  },

  
  async updateApplicationStatus(id, status) {
    const response = await api.put(`/careers/applications/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Job Positions
  async getOpenPositions() {
    const response = await api.get("/careers/positions");
    return response.data;
  },

  async createPosition(data) {
    const response = await api.post("/careers/positions", data);
    return response.data;
  },

  async updatePosition(id, data) {
    const response = await api.put(`/careers/positions/${id}`, data);
    return response.data;
  },

  async deletePosition(id) {
    const response = await api.delete(`/careers/positions/${id}`);
    return response.data;
  },

  async downloadResume(id) {
    console.log('teamService: Downloading resume for id:', id);
    try {
      const response = await api.get(`/api/careers/applications/download/${id}`, {
        responseType: 'blob',
      });
      console.log('teamService: Download successful');
      return response;
    } catch (error) {
      console.error('teamService: Download failed:', error);
      throw error;
    }
  }
};
