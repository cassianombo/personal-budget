import { StyleSheet, Text } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";

const Title = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
  },
});

export default Title;
