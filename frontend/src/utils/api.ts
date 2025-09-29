import { refreshToken } from "@/services/auth.services";
import axios from "axios";

const clearAuthState = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResult = await refreshToken();

        if (refreshResult.success) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
      }

      clearAuthState();
      redirectToLogin();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;