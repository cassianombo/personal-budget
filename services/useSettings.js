import { useCallback, useEffect, useState } from "react";

import settingsService from "./SettingsService";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

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

  const getSetting = useCallback(
    (key, defaultValue = null) => {
      if (!settings) return defaultValue;
      return settings[key] !== undefined ? settings[key] : defaultValue;
    },
    [settings]
  );

  const isSettingEnabled = useCallback(
    (key) => {
      if (!settings) return false;
      return Boolean(settings[key]);
    },
    [settings]
  );

  return {
    settings,
    loading,
    error,

    loadSettings,
    updateSetting,
    updateMultipleSettings,
    resetToDefaults,
    exportSettings,
    importSettings,

    getSetting,
    isSettingEnabled,

    refresh: loadSettings,
  };
};
