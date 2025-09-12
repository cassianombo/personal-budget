import * as SecureStore from "expo-secure-store";

import AuthService from "../../services/AuthService";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:7700",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Sempre carregar o token mais recente do storage
    const token = await SecureStore.getItemAsync("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      if (!refreshToken) {
        console.log("❌ Sem refresh token, redirecionando para login");
        await AuthService.logout();
        return Promise.reject(new Error("Usuário não autenticado"));
      }

      try {
        console.log("🔄 Token expirado, tentando refresh...");
        const newAccessToken = await AuthService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Erro no refresh do token:", refreshError);
        await AuthService.logout();
        return Promise.reject(new Error("Sessão expirada"));
      }
    }

    // Log errors for debugging
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
