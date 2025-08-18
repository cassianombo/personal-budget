import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import React from "react";

export default function AnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis</Text>
      <Text style={styles.subtitle}>
        View your financial insights and reports
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
