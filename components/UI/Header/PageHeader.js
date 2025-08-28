import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import React from "react";

export default function PageHeader({ title, subtitle, style }) {
  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.title]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
