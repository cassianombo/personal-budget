import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import React from "react";
import TextInput from "./TextInput";

const AmountInput = ({
  currency = "€",
  value,
  onChangeText,
  style,
  blurOnSubmit = true,
  transactionType = "expense",
  ...props
}) => {
  const getTextColor = () => {
    const colors = {
      income: COLORS.income,
      expense: COLORS.expense,
      transfer: COLORS.text,
    };
    return colors[transactionType] || COLORS.text;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.currency, { color: getTextColor() }]}>
        {currency}
      </Text>
      <TextInput
        style={[styles.input, { color: getTextColor() }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor={getTextColor() + "80"}
        blurOnSubmit={blurOnSubmit}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 48,
  },
  currency: {
    fontSize: 16,
    color: COLORS.textSecondary,
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    paddingLeft: 0,
  },
});

export default AmountInput;
