import { StyleSheet, Switch, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

export default function SettingOptionToggle({
  title,
  subtitle,
  icon,
  value,
  onValueChange,
  disabled = false,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon.name} size={20} color={icon.color} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, disabled && styles.disabledText]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, disabled && styles.disabledSubtitle]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  disabledSubtitle: {
    color: COLORS.textMuted,
  },
});
