import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { TRANSACTION_TYPE } from "../../constants/Types/transactionTypes";
import TransactionItem from "./TransactionItem";

const TransactionList = ({
  transactions = [],
  onTransactionPress,
  onTransactionLongPress,
  showDateHeaders = true,
  showEmptyState = true,
  emptyStateTitle = "No transactions found",
  emptyStateSubtitle = "Create your first transaction to get started",
  style,
}) => {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    if (!showDateHeaders) {
      return transactions;
    }

    const groups = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    // Convert to array format and sort by date (newest first)
    return Object.entries(groups)
      .map(([date, transactions]) => {
        // Calculate daily total with proper logic
        const totalAmount = transactions.reduce((sum, t) => {
          let amount = 0;

          if (t.type === TRANSACTION_TYPE.EXPENSE) {
            amount = -Math.abs(t.amount); // Ensure negative for expenses
          } else if (t.type === TRANSACTION_TYPE.INCOME) {
            amount = Math.abs(t.amount); // Ensure positive for income
          } else if (t.type === TRANSACTION_TYPE.TRANSFER) {
            // For transfers, we don't count them in daily total as they're just moving money
            amount = 0;
          }

          return sum + amount;
        }, 0);

        return {
          date,
          transactions,
          totalAmount,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, showDateHeaders]);

  const renderDateHeader = ({ date, totalAmount }) => {
    const dateObj = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel;
    if (dateObj.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }

    // Format the daily total
    let totalDisplay = "";
    if (totalAmount === 0) {
      totalDisplay = "$0.00";
    } else {
      const isPositive = totalAmount > 0;
      totalDisplay = `${isPositive ? "+" : ""}$${Math.abs(totalAmount).toFixed(
        2
      )}`;
    }

    return (
      <View style={styles.dateHeader}>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <Text
          style={[
            styles.dateTotal,
            {
              color:
                totalAmount > 0
                  ? COLORS.income
                  : totalAmount < 0
                  ? COLORS.expense
                  : COLORS.textSecondary,
            },
          ]}>
          {totalDisplay}
        </Text>
      </View>
    );
  };

  const renderTransactionGroup = (group) => {
    if (showDateHeaders) {
      return (
        <View key={group.date} style={styles.transactionGroup}>
          {renderDateHeader(group)}
          {group.transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => onTransactionPress?.(transaction)}
              onLongPress={() => onTransactionLongPress?.(transaction.id)}
            />
          ))}
        </View>
      );
    } else {
      return group.transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onPress={() => onTransactionPress?.(transaction)}
          onLongPress={() => onTransactionLongPress?.(transaction.id)}
        />
      ));
    }
  };

  if (transactions.length === 0 && showEmptyState) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyTitle}>{emptyStateTitle}</Text>
        <Text style={styles.emptySubtitle}>{emptyStateSubtitle}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {groupedTransactions.map((group) => renderTransactionGroup(group))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionGroup: {
    marginBottom: 4,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  dateTotal: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default TransactionList;
