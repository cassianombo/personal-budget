import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";
import { TRANSACTION_TYPE } from "../../constants";

const TransactionItem = ({ transaction, onPress }) => {
  const { amount, title, categoryName, type, date } = transaction;

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (type === TRANSACTION_TYPE.TRANSFER) {
      return `$${absAmount.toFixed(2)}`;
    }
    return `${
      type === TRANSACTION_TYPE.EXPENSE ? "-" : "+"
    }$${absAmount.toFixed(2)}`;
  };

  const getTransactionIcon = () => {
    if (type === TRANSACTION_TYPE.TRANSFER) return "swap";
    if (type === TRANSACTION_TYPE.INCOME) return "💰";
    return "💸";
  };

  const getAmountColor = () => {
    if (type === TRANSACTION_TYPE.TRANSFER) return COLORS.balance;
    if (type === TRANSACTION_TYPE.EXPENSE) return COLORS.expense;
    if (type === TRANSACTION_TYPE.INCOME) return COLORS.income;
    return COLORS.text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getTransactionIcon()}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {categoryName && (
            <Text style={styles.category} numberOfLines={1}>
              {categoryName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {formatCurrency(amount)}
        </Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.input,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default TransactionItem;
