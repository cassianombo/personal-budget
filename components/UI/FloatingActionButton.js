import { Pressable, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "./Icon";
import React from "react";

const FloatingActionButton = ({
  onPress,
  icon = "plus",
  size = 24,
  backgroundColor = COLORS.primary,
  iconColor = "#FFFFFF",
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <Icon name={icon} size={size} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // Elegant shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});

export default FloatingActionButton;
