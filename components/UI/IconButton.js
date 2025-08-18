import { Pressable, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "./Icon";
import React from "react";

const IconButton = ({
  icon,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  iconStyle,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const iconStyleArray = [
    styles.icon,
    styles[`${variant}Icon`],
    styles[`${size}Icon`],
    disabled && styles.disabledIcon,
    iconStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [buttonStyle, pressed && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
      {...props}>
      <Icon name={icon} style={iconStyleArray} size={getIconSize(size)} />
    </Pressable>
  );
};

const getIconSize = (size) => {
  const sizes = {
    small: 16,
    medium: 20,
    large: 24,
  };
  return sizes[size] || 20;
};

const styles = StyleSheet.create({
  // Base button styles
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  medium: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  large: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },

  // Icon styles
  icon: {
    textAlign: "center",
  },
  primaryIcon: {
    color: COLORS.text,
  },
  secondaryIcon: {
    color: COLORS.text,
  },
  dangerIcon: {
    color: COLORS.text,
  },
  outlineIcon: {
    color: COLORS.primary,
  },
  ghostIcon: {
    color: COLORS.primary,
  },

  // Icon sizes
  smallIcon: {
    fontSize: 16,
  },
  mediumIcon: {
    fontSize: 20,
  },
  largeIcon: {
    fontSize: 24,
  },

  // States
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledIcon: {
    color: COLORS.textMuted,
  },
});

export default IconButton;
