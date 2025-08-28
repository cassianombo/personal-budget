import { getAllSettings, getSettingConfig } from "../constants/settings";

import AsyncStorage from "@react-native-async-storage/async-storage";

class SettingsService {
  constructor() {
    this.SETTINGS_KEY = "@app_settings";
    this.settings = null;
  }

  // Initialize settings (load from storage or use defaults)
  async initialize() {
    try {
      const storedSettings = await AsyncStorage.getItem(this.SETTINGS_KEY);

      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        this.settings = { ...getAllSettings(), ...parsedSettings };
      } else {
        this.settings = { ...getAllSettings() };
        await this.saveSettings();
      }
      return this.settings;
    } catch (error) {
      console.error("❌ Error initializing settings:", error);
      this.settings = { ...getAllSettings() };
      return this.settings;
    }
  }

  // Get all settings
  async getAllSettings() {
    if (!this.settings) {
      await this.initialize();
    }
    return { ...this.settings };
  }

  // Get a specific setting
  async getSetting(key) {
    if (!this.settings) {
      await this.initialize();
    }
    return this.settings[key];
  }

  // Set a specific setting
  async setSetting(key, value) {
    if (!this.settings) {
      await this.initialize();
    }

    // Validate setting exists
    const config = getSettingConfig(key);
    if (!config) {
      throw new Error(`Setting "${key}" not found in configuration`);
    }

    this.settings[key] = value;
    await this.saveSettings();
    return this.settings;
  }

  // Set multiple settings at once
  async setMultipleSettings(settings) {
    if (!this.settings) {
      await this.initialize();
    }

    // Validate all settings exist
    for (const key of Object.keys(settings)) {
      if (!getSettingConfig(key)) {
        throw new Error(`Setting "${key}" not found in configuration`);
      }
    }

    this.settings = { ...this.settings, ...settings };
    await this.saveSettings();
    return this.settings;
  }

  // Reset settings to defaults
  async resetToDefaults() {
    this.settings = { ...getAllSettings() };
    await this.saveSettings();
    return this.settings;
  }

  // Save settings to AsyncStorage
  async saveSettings() {
    try {
      await AsyncStorage.setItem(
        this.SETTINGS_KEY,
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      throw error;
    }
  }

  // Clear all settings
  async clearSettings() {
    try {
      await AsyncStorage.removeItem(this.SETTINGS_KEY);
      this.settings = null;
    } catch (error) {
      console.error("❌ Error clearing settings:", error);
      throw error;
    }
  }

  // Export settings
  async exportSettings() {
    if (!this.settings) {
      await this.initialize();
    }
    return JSON.stringify(this.settings, null, 2);
  }

  // Import settings
  async importSettings(settingsJson) {
    try {
      const importedSettings = JSON.parse(settingsJson);

      // Validate imported settings
      for (const key of Object.keys(importedSettings)) {
        if (!getSettingConfig(key)) {
          console.warn(`Warning: Unknown setting "${key}" will be ignored`);
        }
      }

      this.settings = { ...getAllSettings(), ...importedSettings };
      await this.saveSettings();
      return this.settings;
    } catch (error) {
      console.error("❌ Error importing settings:", error);
      throw new Error("Invalid settings format");
    }
  }

  // Get setting metadata
  getSettingMetadata(key) {
    return getSettingConfig(key);
  }

  // Get all settings metadata
  getAllSettingsMetadata() {
    return getAllSettings();
  }
}

// Create singleton instance
const settingsService = new SettingsService();

export default settingsService;
