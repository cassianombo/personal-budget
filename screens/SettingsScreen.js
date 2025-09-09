import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SettingItem, SettingToggle, Title } from "../components/UI";

import { COLORS } from "../constants/colors";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSettingsByCategory } from "../constants/settings";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../services/useSettings";

export default function SettingsScreen() {
  const {
    settings,
    loading,
    error,
    updateSetting,
    resetToDefaults,
    exportSettings,
  } = useSettings();

  const { logout } = useAuth();

  const settingsConfig = getSettingsByCategory();

  const handleSettingPress = (settingName) => {
    console.log(`Pressed: ${settingName}`);
  };

  const handleToggleSetting = async (key, value) => {
    try {
      await updateSetting(key, value);
    } catch (err) {
      Alert.alert("Error", "Failed to update setting");
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to defaults?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetToDefaults();
              Alert.alert("Success", "Settings reset to defaults");
            } catch (err) {
              Alert.alert("Error", "Failed to reset settings");
            }
          },
        },
      ]
    );
  };

  const handleExportSettings = async () => {
    try {
      const settingsJson = await exportSettings();
      console.log("Settings exported:", settingsJson);
      Alert.alert("Success", "Settings exported successfully");
    } catch (err) {
      Alert.alert("Error", "Failed to export settings");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            Alert.alert("Success", "Logged out successfully");
          } catch (err) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const renderSettingItem = (settingKey, settingConfig) => {
    const currentValue = settings?.[settingKey];

    switch (settingConfig.type) {
      case "toggle":
        return (
          <SettingToggle
            title={settingConfig.label}
            subtitle={settingConfig.description}
            icon={{ name: settingConfig.icon, color: COLORS.primary }}
            value={currentValue || settingConfig.defaultValue}
            onValueChange={(value) => handleToggleSetting(settingKey, value)}
          />
        );

      case "select":
        return (
          <SettingItem
            title={settingConfig.label}
            subtitle={currentValue || settingConfig.defaultValue}
            icon={settingConfig.icon}
            onPress={() => handleSettingPress(settingConfig.label)}
          />
        );

      case "readonly":
        return (
          <SettingItem
            title={settingConfig.label}
            subtitle={currentValue || "Not set"}
            icon={settingConfig.icon}
            onPress={() => {}}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading settings: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>Settings</Title>
          <Text style={styles.subtitle}>Customize your app preferences</Text>
        </View>

        {/* Render settings by category */}
        {Object.entries(settingsConfig).map(
          ([categoryKey, categorySettings]) => (
            <View key={categoryKey} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>
                {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
              </Text>

              {Object.entries(categorySettings).map(
                ([settingKey, settingConfig]) => (
                  <View key={settingKey}>
                    {renderSettingItem(settingKey, settingConfig)}
                  </View>
                )
              )}
            </View>
          )
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingItem
            title="Logout"
            subtitle="Sign out of your account"
            icon="left"
            onPress={handleLogout}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <SettingItem
            title="Export Settings"
            subtitle="Download your app configuration"
            icon="download"
            onPress={handleExportSettings}
          />

          {/* AsyncStorage debug removed - no longer using local database */}

          <SettingItem
            title="Reset to Defaults"
            subtitle="Restore all settings to default values"
            icon="login"
            onPress={handleResetSettings}
          />
        </View>

        {/* Database settings removed - no longer using local database */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 100, // Extra space for bottom tab navigation
  },
  header: {
    padding: 20,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
  },
});
