export const tokenUtils = {
  setToken(token) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  setupAxiosInterceptors(axios) {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  },
};
