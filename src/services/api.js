import api from "../utils/axios";

export const apiService = {
  // Staff endpoints
  async getStaffProfile() {
    const response = await api.get("/staff/profile");
    return response.data;
  },

  async updateStaffProfile(data) {
    const response = await api.put("/staff/profile", data);
    return response.data;
  },

  async getStaffSchedule() {
    const response = await api.get("/staff/schedule");
    return response.data;
  },

  async logTime(timeData) {
    const response = await api.post("/staff/time-logs", timeData);
    return response.data;
  },

  // Admin endpoints
  async getAllStaff() {
    const response = await api.get("/admin/staff");
    return response.data;
  },

  async createStaff(staffData) {
    const response = await api.post("/admin/staff", staffData);
    return response.data;
  },

  async updateStaff(id, staffData) {
    const response = await api.put(`/admin/staff/${id}`, staffData);
    return response.data;
  },

  async deleteStaff(id) {
    const response = await api.delete(`/admin/staff/${id}`);
    return response.data;
  },

  // Client endpoints
  async getClients() {
    const response = await api.get("/clients");
    return response.data;
  },

  async getClientDetails(id) {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async createClient(clientData) {
    const response = await api.post("/clients", clientData);
    return response.data;
  },

  async updateClient(id, clientData) {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  async deleteClient(id) {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};
