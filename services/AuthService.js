import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { AUTH_CONFIG, validateAuthConfig } from "../config/auth.config";

import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  async loginWithGoogle() {
    try {
      const backendAuthUrl = `${AUTH_CONFIG.API_BASE_URL}/auth/google/login`;

      const result = await WebBrowser.openAuthSessionAsync(
        backendAuthUrl,
        "personal-finances-app://auth"
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          await this.saveTokens(accessToken, refreshToken);
          return { access_token: accessToken, refresh_token: refreshToken };
        }
      }

      throw new Error("Falha na autenticação com Google");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      throw error;
    }
  }

  async saveTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.multiSet([
        ["access_token", accessToken],
        ["refresh_token", refreshToken],
      ]);

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    } catch (error) {
      console.error("Erro ao salvar tokens:", error);
      throw error;
    }
  }

  async loadTokens() {
    try {
      const tokens = await AsyncStorage.multiGet([
        "access_token",
        "refresh_token",
      ]);
      const accessToken = tokens[0][1];
      const refreshToken = tokens[1][1];

      if (accessToken && refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        return { accessToken, refreshToken };
      }

      return null;
    } catch (error) {
      console.error("Erro ao carregar tokens:", error);
      return null;
    }
  }

  async logout() {
    try {
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  }

  async isAuthenticated() {
    const tokens = await this.loadTokens();
    return tokens !== null;
  }

  getAccessToken() {
    return this.accessToken;
  }

  async authenticatedRequest(url, options = {}) {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error("Refresh token não disponível");
      }

      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha na renovação do token");
      }

      const data = await response.json();
      await this.saveTokens(data.access_token, this.refreshToken);

      return data.access_token;
    } catch (error) {
      console.error("Erro na renovação do token:", error);
      await this.logout();
      throw error;
    }
  }
}

export default new AuthService();
