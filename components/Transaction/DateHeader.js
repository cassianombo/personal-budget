import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";

const DateHeader = ({ date, totalAmount = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTotalAmount = (amount) => {
    if (amount === 0) return "$0.00";
    const isPositive = amount > 0;
    return `${isPositive ? "+" : ""}$${amount.toFixed(2)}`;
  };

  const getTotalAmountColor = () => {
    if (totalAmount === 0) return COLORS.textSecondary;
    return totalAmount > 0 ? COLORS.income : COLORS.expense;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate(date)}</Text>
      <Text style={[styles.totalAmount, { color: getTotalAmountColor() }]}>
        {formatTotalAmount(totalAmount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default DateHeader;
