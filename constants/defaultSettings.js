// Centralized default user settings
// This file contains the single source of truth for all default user settings
// Used by both frontend and backend to ensure consistency

export const DEFAULT_USER_SETTINGS = {
  language: "en",
  currency: "USD",
  biometricLockEnabled: false,
};

// Available options for each setting
export const SETTING_OPTIONS = {
  language: [
    { value: "en", label: "English" },
    { value: "pt", label: "Português" },
    { value: "es", label: "Español" },
  ],
  currency: [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "BRL", label: "BRL (R$)" },
  ],
};

// Validation rules for settings
export const SETTING_VALIDATION = {
  language: ["en", "pt", "es"],
  currency: ["USD", "EUR", "GBP", "BRL"],
  biometricLockEnabled: [true, false],
};
