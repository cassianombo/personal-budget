import { Pressable, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "./Icon";
import React from "react";

const FloatingActionButton = ({
  onPress,
  icon = "plus",
  size = 24,
  backgroundColor = COLORS.primary,
  iconColor = COLORS.background,
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
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default FloatingActionButton;
