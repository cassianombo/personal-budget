import { Pressable, StyleSheet, Text } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [buttonStyle, pressed && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
      {...props}>
      <Text style={buttonTextStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Base button styles
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },

  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 10,
  },

  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: COLORS.text,
  },
  secondaryText: {
    color: COLORS.text,
  },
  dangerText: {
    color: COLORS.text,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },

  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // States
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});

export default Button;
