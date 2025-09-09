import { getAllSettings, getSettingConfig } from "../constants/settings";

import AsyncStorage from "@react-native-async-storage/async-storage";

class SettingsService {
  constructor() {
    this.SETTINGS_KEY = "@app_settings";
    this.settings = null;
  }

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

  async getAllSettings() {
    if (!this.settings) {
      await this.initialize();
    }
    return { ...this.settings };
  }

  async getSetting(key) {
    if (!this.settings) {
      await this.initialize();
    }
    return this.settings[key];
  }

  async setSetting(key, value) {
    if (!this.settings) {
      await this.initialize();
    }

    const config = getSettingConfig(key);
    if (!config) {
      throw new Error(`Setting "${key}" not found in configuration`);
    }

    this.settings[key] = value;
    await this.saveSettings();
    return this.settings;
  }

  async setMultipleSettings(settings) {
    if (!this.settings) {
      await this.initialize();
    }

    for (const key of Object.keys(settings)) {
      if (!getSettingConfig(key)) {
        throw new Error(`Setting "${key}" not found in configuration`);
      }
    }

    this.settings = { ...this.settings, ...settings };
    await this.saveSettings();
    return this.settings;
  }

  async resetToDefaults() {
    this.settings = { ...getAllSettings() };
    await this.saveSettings();
    return this.settings;
  }

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

  async clearSettings() {
    try {
      await AsyncStorage.removeItem(this.SETTINGS_KEY);
      this.settings = null;
    } catch (error) {
      console.error("❌ Error clearing settings:", error);
      throw error;
    }
  }

  async exportSettings() {
    if (!this.settings) {
      await this.initialize();
    }
    return JSON.stringify(this.settings, null, 2);
  }

  async importSettings(settingsJson) {
    try {
      const importedSettings = JSON.parse(settingsJson);

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

  getSettingMetadata(key) {
    return getSettingConfig(key);
  }

  getAllSettingsMetadata() {
    return getAllSettings();
  }
}

const settingsService = new SettingsService();

export default settingsService;
