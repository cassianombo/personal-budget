// App Settings Configuration
export const SETTINGS_CONFIG = {
  // General Settings
  general: {
    language: {
      key: "language",
      type: "select",
      defaultValue: "en",
      label: "Language",
      description: "App language",
      icon: "earth",
      options: [
        { value: "en", label: "English" },
        { value: "pt", label: "Português" },
        { value: "es", label: "Español" },
      ],
    },
    currency: {
      key: "currency",
      type: "select",
      defaultValue: "USD",
      label: "Currency",
      description: "Default currency",
      icon: "wallet",
      options: [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
        { value: "BRL", label: "BRL (R$)" },
      ],
    },
  },

  // Privacy & Security Settings
  privacy: {
    biometricLockEnabled: {
      key: "biometricLockEnabled",
      type: "toggle",
      defaultValue: false,
      label: "Biometric Lock",
      description: "Use fingerprint or face ID to unlock",
      icon: "lock",
      category: "security",
    },
  },
};

// Helper functions
export const getSettingConfig = (key) => {
  for (const category of Object.values(SETTINGS_CONFIG)) {
    if (category[key]) {
      return category[key];
    }
  }
  return null;
};

export const getAllSettings = () => {
  const allSettings = {};
  Object.values(SETTINGS_CONFIG).forEach((category) => {
    Object.values(category).forEach((setting) => {
      allSettings[setting.key] = setting.defaultValue;
    });
  });
  return allSettings;
};

export const getSettingsByCategory = () => {
  return SETTINGS_CONFIG;
};

export const getSettingsKeys = () => {
  const keys = [];
  Object.values(SETTINGS_CONFIG).forEach((category) => {
    Object.values(category).forEach((setting) => {
      keys.push(setting.key);
    });
  });
  return keys;
};
