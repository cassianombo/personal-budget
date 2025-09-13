import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

export default function SettingOptionItem({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
  disabled = false,
  style,
  ...props
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}>
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color={COLORS.primary} />
          </View>
        )}
        <View
          style={[styles.textContainer, !icon && styles.textContainerNoIcon]}>
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
        <View style={styles.rightElement}>
          {rightElement || <Text style={styles.chevron}>›</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  textContainerNoIcon: {
    marginLeft: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  rightElement: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
  },
  chevron: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: "300",
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: COLORS.input,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  disabledSubtitle: {
    color: COLORS.textMuted,
  },
});
