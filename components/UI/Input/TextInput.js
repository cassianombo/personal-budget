import { TextInput as RNTextInput, StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import React from "react";

const TextInput = ({
  style,
  placeholderTextColor = COLORS.textSecondary,
  multiline = false,
  ...props
}) => {
  return (
    <RNTextInput
      style={[styles.input, multiline && styles.multiline, style]}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 48,
    marginBottom: 16,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default TextInput;
