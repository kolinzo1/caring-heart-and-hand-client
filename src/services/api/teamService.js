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
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    });

    const response = await api.post("/careers/apply", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getApplications(filters = {}) {
    const response = await api.get("/careers/applications", {
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
};
