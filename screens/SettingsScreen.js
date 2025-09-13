import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SettingOptionItem, SettingOptionToggle } from "../components/Settings";
import { useSettings, useUsers } from "../services";

import { COLORS } from "../constants/colors";
import { OptionModal } from "../components/UI";
import PageHeader from "../components/UI/Header/PageHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const { updateUserSettings, useUserSettings } = useUsers();
  const { userSettingsQuery } = useSettings();
  const { logout } = useAuth();

  const { data: settings, isLoading: loading, error } = useUserSettings;
  const { data: settingsOptions } = userSettingsQuery;
  const isUpdatingSettings = updateUserSettings.isPending;
  // OptionModal state
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [modalOptions, setModalOptions] = useState([]);

  const handleSelectPress = (settingKey, options) => {
    const formattedOptions = options.map((option) => ({
      id: option.value,
      name: option.label,
      value: option.value,
    }));

    setCurrentSetting({ key: settingKey });
    setModalOptions(formattedOptions);
    setOptionModalVisible(true);
  };

  const handleOptionSelect = async (selectedOption) => {
    if (currentSetting) {
      try {
        await updateUserSettings.mutateAsync({
          [currentSetting.key]: selectedOption.value,
        });
        setOptionModalVisible(false);
        setCurrentSetting(null);
        setModalOptions([]);
      } catch (error) {
        Alert.alert("Error", "Failed to update setting. Please try again.");
      }
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
          } catch (err) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={[styles.text, { color: COLORS.error }]}>
            Error loading settings: {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <PageHeader title="Settings" />
          <Text style={styles.subtitle}>Customize your app preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <SettingOptionItem
            title="Language"
            subtitle={settings.language}
            icon="earth"
            disabled={isUpdatingSettings}
            onPress={() =>
              handleSelectPress("language", settingsOptions?.language || [])
            }
          />

          <SettingOptionItem
            title="Currency"
            subtitle={settings.currency}
            icon="wallet"
            disabled={isUpdatingSettings}
            onPress={() =>
              handleSelectPress("currency", settingsOptions?.currency || [])
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <SettingOptionToggle
            title="Biometric Lock"
            subtitle="Use fingerprint or face ID to unlock"
            icon={{ name: "lock", color: COLORS.primary }}
            value={settings?.isBiometricLocked || false}
            disabled={isUpdatingSettings}
            onValueChange={async (value) => {
              try {
                await updateUserSettings.mutateAsync({
                  isBiometricLocked: value,
                });
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to update setting. Please try again."
                );
              }
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingOptionItem
            title="Logout"
            subtitle="Sign out of your account"
            icon="left"
            onPress={handleLogout}
          />
        </View>

        {/* OptionModal for select settings */}
        <OptionModal
          visible={optionModalVisible}
          onClose={() => setOptionModalVisible(false)}
          title="Select Option"
          options={modalOptions}
          onSelect={handleOptionSelect}
          selectedValue={settings?.[currentSetting?.key]}
          showIcons={false}
        />
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
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: COLORS.text,
  },
});
