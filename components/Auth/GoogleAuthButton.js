import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

const GoogleAuthButton = ({
  onPress,
  disabled = false,
  loading = false,
  title = "Entrar com Google",
  style,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={COLORS.text} size="small" />
        ) : (
          <Ionicons name="logo-google" size={20} color={COLORS.text} />
        )}
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
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

export default GoogleAuthButton;
