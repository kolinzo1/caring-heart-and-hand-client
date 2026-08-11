import api from "../../lib/axios";

export const onboardingService = {
  getHiredApplicants: async () => {
    const response = await api.get("/api/onboarding/applicants");
    return response.data;
  },

  getApplicantSubmissions: async (applicationId) => {
    const response = await api.get(`/api/onboarding/applicants/${applicationId}/submissions`);
    return response.data;
  },

  downloadOnboardingPdf: async (applicationId) => {
    const response = await api.get(`/api/onboarding/applicants/${applicationId}/pdf`, {
      responseType: "blob",
    });
    return response;
  },

  reviewSubmission: async (submissionId, status, adminNotes) => {
    const response = await api.put(`/api/onboarding/submissions/${submissionId}/review`, {
      status,
      admin_notes: adminNotes,
    });
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get("/api/onboarding/templates");
    return response.data;
  },

  createTemplate: async (templateData) => {
    const formData = new FormData();
    Object.entries(templateData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    const response = await api.post("/api/onboarding/templates", formData, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/api/onboarding/templates/${id}`, templateData);
    return response.data;
  },
};
