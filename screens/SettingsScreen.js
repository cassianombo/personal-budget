import { ScrollView, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import DatabaseSettings from "../components/Settings/DatabaseSettings";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title } from "../components/UI";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>Settings</Title>
          <Text style={styles.subtitle}>Customize your app preferences</Text>
        </View>

        <DatabaseSettings />
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
});
