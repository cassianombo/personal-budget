import React, { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/AuthService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [lastLogTime, setLastLogTime] = useState(0);

  // Verificar se o usuário está autenticado ao inicializar
  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuthStatus();
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth]);

  const checkAuthStatus = async () => {
    const now = Date.now();
    const timeSinceLastLog = now - lastLogTime;

    // Só fazer log se passou mais de 2 segundos desde o último log
    if (timeSinceLastLog > 2000) {
      console.log("🔍 VERIFICANDO STATUS DE AUTENTICAÇÃO...");
      setLastLogTime(now);
    }

    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Carregar tokens para mostrar informações do usuário
        const tokens = await authService.loadTokens();
        const userData = { authenticated: true, ...tokens };
        setUser(userData);

        // Print do conteúdo do usuário quando já está autenticado (só se passou tempo suficiente)
        if (timeSinceLastLog > 2000) {
          console.log("✅ USUÁRIO JÁ AUTENTICADO!");
          console.log("📊 Conteúdo do usuário:", userData);
          console.log(
            "🎫 Access Token:",
            tokens?.accessToken ? "Presente" : "Ausente"
          );
          console.log(
            "🔄 Refresh Token:",
            tokens?.refreshToken ? "Presente" : "Ausente"
          );
        }
      } else {
        setUser(null);
        if (timeSinceLastLog > 2000) {
          console.log("❌ Usuário não autenticado");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await authService.loginWithGoogle();

      if (result) {
        setIsAuthenticated(true);
        const userData = { authenticated: true, ...result };
        setUser(userData);

        // Print do conteúdo do usuário após login
        console.log("🔐 LOGIN REALIZADO COM SUCESSO!");
        console.log("📊 Conteúdo do usuário:", userData);
        console.log(
          "🎫 Access Token:",
          result.access_token ? "Presente" : "Ausente"
        );
        console.log(
          "🔄 Refresh Token:",
          result.refresh_token ? "Presente" : "Ausente"
        );

        return result;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Print do conteúdo do usuário antes do logout
      console.log("🚪 FAZENDO LOGOUT...");
      console.log("📊 Usuário atual antes do logout:", user);

      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);

      console.log("✅ LOGOUT REALIZADO COM SUCESSO!");
      console.log("📊 Usuário após logout:", null);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
