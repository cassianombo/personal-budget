import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/AuthService";
import { useUsers } from "../services/api/hooks/useUsers";

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

  const [shouldLoadUserData, setShouldLoadUserData] = useState(false);

  const { userProfile } = useUsers(shouldLoadUserData);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    refetch: fetchUserData,
  } = userProfile;

  // Log dos dados do utilizador quando chegarem
  useEffect(() => {
    if (userData) {
      console.log("👤 DADOS DO UTILIZADOR RECEBIDOS:", userData);
    }
  }, [userData]);

  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuthStatus();
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth]);

  useEffect(() => {
    const handleTokenChange = () => {
      console.log("🔄 Tokens atualizados, verificando status...");
      checkAuthStatus();
    };

    authService.addTokenChangeListener(handleTokenChange);

    return () => {
      authService.removeTokenChangeListener(handleTokenChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const tokens = await authService.loadTokens();
        const userAuthData = { authenticated: true, ...tokens };
        setUser(userAuthData);
        setShouldLoadUserData(true);
        console.log("✅ Usuário autenticado");
        console.log("🎫 ACCESS TOKEN:", tokens?.accessToken);
        console.log("🔄 REFRESH TOKEN:", tokens?.refreshToken);
      } else {
        setUser(null);
        setShouldLoadUserData(false);
        console.log("❌ Usuário não autenticado");
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
      setIsAuthenticated(false);
      setUser(null);
      setShouldLoadUserData(false);
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
        const userAuthData = { authenticated: true, ...result };
        setUser(userAuthData);
        setShouldLoadUserData(true);

        console.log("🔐 LOGIN REALIZADO COM SUCESSO!");
        console.log("🎫 ACCESS TOKEN:", result.access_token);
        console.log("🔄 REFRESH TOKEN:", result.refresh_token);
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

      console.log("🚪 FAZENDO LOGOUT...");

      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setShouldLoadUserData(false);

      console.log("✅ LOGOUT REALIZADO COM SUCESSO!");
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Combinar dados de autenticação e perfil do usuário
  const userProfileData = useMemo(() => {
    if (!isAuthenticated || !userData) return null;
    return {
      ...user, // Dados de autenticação (tokens)
      profile: userData, // Dados do perfil (API)
    };
  }, [isAuthenticated, user, userData]);

  const value = {
    // Dados do usuário unificados
    userProfile: userProfileData,
    authTokens: user, // Apenas tokens de autenticação
    userProfileData: userData, // Apenas dados do perfil da API

    // Estados de autenticação
    isAuthenticated,
    isAuthLoading: isLoading,
    isProfileLoading: isUserDataLoading,
    isLoading: isLoading || isUserDataLoading,

    // Ações de autenticação
    loginWithGoogle,
    logout,
    checkAuthStatus,
    refreshUserProfile: fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
