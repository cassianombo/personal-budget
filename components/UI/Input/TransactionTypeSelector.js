import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import React from "react";
import { TRANSACTION_TYPE } from "../../../constants";

const TransactionTypeSelector = ({ value, onSelect, style }) => {
  const types = [
    { key: TRANSACTION_TYPE.EXPENSE, label: "Expense", color: COLORS.expense },
    { key: TRANSACTION_TYPE.INCOME, label: "Income", color: COLORS.income },
    {
      key: TRANSACTION_TYPE.TRANSFER,
      label: "Transfer",
      color: COLORS.balance,
    },
  ];

  const renderButton = (type, index) => {
    const isActive = value === type.key;
    const isFirst = index === 0;
    const isLast = index === types.length - 1;

    return (
      <Pressable
        key={type.key}
        style={({ pressed }) => [
          styles.button,
          isActive && styles.buttonActive,
          {
            backgroundColor: isActive ? type.color : COLORS.card,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          { borderColor: type.color },
          isFirst && styles.firstButton,
          isLast && styles.lastButton,
        ]}
        onPress={() => onSelect(type.key)}>
        <Text
          style={[
            styles.buttonText,
            isActive && styles.buttonTextActive,
            { color: isActive ? COLORS.background : type.color },
          ]}>
          {type.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonsContainer}>{types.map(renderButton)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  firstButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  lastButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonTextActive: {
    color: COLORS.background,
  },
});

export default TransactionTypeSelector;
