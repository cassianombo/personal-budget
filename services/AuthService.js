import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

import { AUTH_CONFIG, validateAuthConfig } from "../config/auth.config";

import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.listeners = [];
  }

  // Adicionar listener para mudanças de token
  addTokenChangeListener(callback) {
    this.listeners.push(callback);
  }

  // Remover listener
  removeTokenChangeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notificar todos os listeners sobre mudanças de token
  notifyTokenChange() {
    this.listeners.forEach((callback) => callback());
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
      await SecureStore.setItemAsync("access_token", accessToken);
      await SecureStore.setItemAsync("refresh_token", refreshToken);

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      // Notificar listeners sobre mudança de tokens
      this.notifyTokenChange();
    } catch (error) {
      console.error("Erro ao salvar tokens:", error);
      throw error;
    }
  }

  async loadTokens() {
    try {
      // First, try to load from SecureStore
      let accessToken = await SecureStore.getItemAsync("access_token");
      let refreshToken = await SecureStore.getItemAsync("refresh_token");

      // If not found in SecureStore, try to migrate from AsyncStorage
      if (!accessToken || !refreshToken) {
        const legacyTokens = await AsyncStorage.multiGet([
          "access_token",
          "refresh_token",
        ]);
        const legacyAccessToken = legacyTokens[0][1];
        const legacyRefreshToken = legacyTokens[1][1];

        if (legacyAccessToken && legacyRefreshToken) {
          // Migrate to SecureStore
          await this.saveTokens(legacyAccessToken, legacyRefreshToken);
          // Clean up AsyncStorage
          await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

          accessToken = legacyAccessToken;
          refreshToken = legacyRefreshToken;
        }
      }

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
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      // Also clean AsyncStorage in case there are legacy tokens
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

      this.accessToken = null;
      this.refreshToken = null;

      // Notificar listeners sobre mudança de tokens
      this.notifyTokenChange();
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  }

  async isAuthenticated() {
    const tokens = await this.loadTokens();
    return tokens !== null;
  }

  async getAccessToken() {
    // Sempre carregar o token mais recente do storage
    const tokens = await this.loadTokens();
    return tokens?.accessToken || this.accessToken;
  }

  async authenticatedRequest(url, options = {}) {
    const token = await this.getAccessToken();

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
      // Carregar tokens atualizados do storage
      const tokens = await this.loadTokens();
      if (!tokens?.refreshToken) {
        throw new Error("Refresh token não disponível");
      }

      console.log(
        "🔄 Tentando refresh com token:",
        tokens.refreshToken.substring(0, 20) + "..."
      );

      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "❌ Erro na resposta do refresh:",
          response.status,
          errorData
        );
        throw new Error(`Falha na renovação do token: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Refresh bem-sucedido, salvando novos tokens");

      // Salvar o novo access token e manter o refresh token
      await this.saveTokens(data.accessToken, tokens.refreshToken);

      // Atualizar as propriedades da instância
      this.accessToken = data.accessToken;
      this.refreshToken = tokens.refreshToken;

      return data.accessToken;
    } catch (error) {
      console.error("❌ Erro na renovação do token:", error);
      await this.logout();
      throw error;
    }
  }
}

export default new AuthService();
