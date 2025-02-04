const BASE_URL = "/api/auth";

export const authService = {
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to register");
    }

    return response.json();
  },

  async logout() {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } finally {
      localStorage.removeItem("token");
    }
  },

  async forgotPassword(email) {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset email");
    }

    return response.json();
  },

  async resetPassword(token, newPassword) {
    const response = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reset password");
    }

    return response.json();
  },

  async validateToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        return null;
      }

      return response.json();
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;
