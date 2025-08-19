import { COLORS } from "../../constants/colors";
import IconButton from "./IconButton";
import React from "react";
import { StyleSheet } from "react-native";

const HeaderButton = ({
  variant = "action", // "back", "edit", "delete", "add", "action"
  icon,
  onPress,
  style,
  ...props
}) => {
  // Auto-determine icon based on variant if not provided
  const buttonIcon = icon || getDefaultIcon(variant);

  return (
    <IconButton
      icon={buttonIcon}
      onPress={onPress}
      variant={getVariant(variant)}
      size="medium"
      style={[getHeaderButtonStyle(variant), style]}
      {...props}
    />
  );
};

const getDefaultIcon = (variant) => {
  const icons = {
    back: "left",
    edit: "edit",
    delete: "delete",
    add: "plus",
    action: "edit", // fallback
  };
  return icons[variant] || "edit";
};

const getVariant = (variant) => {
  const variants = {
    back: "ghost",
    edit: "outline",
    delete: "danger",
    add: "outline",
    action: "outline",
  };
  return variants[variant] || "outline";
};

const getHeaderButtonStyle = (variant) => {
  const baseStyle = {
    width: 40,
    height: 40,
  };

  // Special styling for back button (no border, different positioning)
  if (variant === "back") {
    return baseStyle;
  }

  // Special styling for delete button (red background)
  if (variant === "delete") {
    return {
      ...baseStyle,
      backgroundColor: COLORS.error,
      borderWidth: 1,
      borderColor: COLORS.error,
    };
  }

  // Action buttons get the card-like styling
  return {
    ...baseStyle,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  };
};

export default HeaderButton;
