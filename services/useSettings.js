import { useCallback, useEffect, useState } from "react";

import settingsService from "./SettingsService";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load all settings
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSettings = await settingsService.getAllSettings();
      setSettings(loadedSettings);
    } catch (err) {
      setError(err.message);
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(async (key, value) => {
    try {
      setError(null);
      const updatedSettings = await settingsService.setSetting(key, value);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      console.error("Error updating setting:", err);
      throw err;
    }
  }, []);

  // Update multiple settings
  const updateMultipleSettings = useCallback(async (newSettings) => {
    try {
      setError(null);
      const updatedSettings = await settingsService.setMultipleSettings(
        newSettings
      );
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      console.error("Error updating multiple settings:", err);
      throw err;
    }
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    try {
      setError(null);
      const defaultSettings = await settingsService.resetToDefaults();
      setSettings(defaultSettings);
      return defaultSettings;
    } catch (err) {
      setError(err.message);
      console.error("Error resetting settings:", err);
      throw err;
    }
  }, []);

  // Export settings
  const exportSettings = useCallback(async () => {
    try {
      setError(null);
      return await settingsService.exportSettings();
    } catch (err) {
      setError(err.message);
      console.error("Error exporting settings:", err);
      throw err;
    }
  }, []);

  // Import settings
  const importSettings = useCallback(async (settingsJson) => {
    try {
      setError(null);
      const importedSettings = await settingsService.importSettings(
        settingsJson
      );
      setSettings(importedSettings);
      return importedSettings;
    } catch (err) {
      setError(err.message);
      console.error("Error importing settings:", err);
      throw err;
    }
  }, []);

  // Get a specific setting value
  const getSetting = useCallback(
    (key, defaultValue = null) => {
      if (!settings) return defaultValue;
      return settings[key] !== undefined ? settings[key] : defaultValue;
    },
    [settings]
  );

  // Check if a setting is enabled
  const isSettingEnabled = useCallback(
    (key) => {
      if (!settings) return false;
      return Boolean(settings[key]);
    },
    [settings]
  );

  return {
    // State
    settings,
    loading,
    error,

    // Actions
    loadSettings,
    updateSetting,
    updateMultipleSettings,
    resetToDefaults,
    exportSettings,
    importSettings,

    // Helpers
    getSetting,
    isSettingEnabled,

    // Refresh
    refresh: loadSettings,
  };
};
