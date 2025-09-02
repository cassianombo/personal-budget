// Configuração de autenticação
export const AUTH_CONFIG = {
  // URL base da API
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:7700",

  // Configurações de timeout
  TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,

  // Modo debug
  DEBUG: process.env.EXPO_PUBLIC_DEBUG_MODE === "true",
};

// Validação das configurações necessárias
export const validateAuthConfig = () => {
  const errors = [];

  if (!AUTH_CONFIG.API_BASE_URL) {
    errors.push("EXPO_PUBLIC_API_BASE_URL não está definido");
  }

  if (errors.length > 0) {
    console.warn("Configurações de autenticação incompletas:", errors);
    return false;
  }

  return true;
};
