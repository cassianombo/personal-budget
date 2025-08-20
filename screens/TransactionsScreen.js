import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  CreateTransactionModal,
  TransactionItem,
} from "../components/Transaction";
import { FloatingActionButton, PageHeader } from "../components/UI";
import { useCallback, useMemo, useState } from "react";
import { useDeleteTransaction, useTransactions } from "../services/useDatabase";

import { COLORS } from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { TRANSACTION_TYPE } from "../constants/Types/transactionTypes";

export default function TransactionsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: transactions = [],
    isLoading,
    error,
    refetch,
  } = useTransactions();
  const deleteTransactionMutation = useDeleteTransaction();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Filter transactions based on selected type
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, selectedType]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = {};

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    // Convert to array format for FlatList

    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
      totalAmount: transactions.reduce(
        (sum, t) =>
          sum +
          (t.type === TRANSACTION_TYPE.EXPENSE
            ? -t.amount
            : t.type === TRANSACTION_TYPE.INCOME
            ? t.amount
            : 0),
        0
      ),
    }));
  }, [filteredTransactions]);

  const handleDeleteTransaction = (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransactionMutation.mutate(transactionId),
        },
      ]
    );
  };

  const handleTransactionPress = (transaction) => {
    Alert.alert(
      "Transaction Details",
      `Title: ${transaction.title}\nAmount: $${Math.abs(
        transaction.amount
      ).toFixed(2)}\nType: ${transaction.type}\nDate: ${new Date(
        transaction.date
      ).toLocaleDateString()}`,
      [{ text: "OK" }]
    );
  };

  const renderDateHeader = ({ item }) => {
    const date = new Date(item.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel;
    if (date.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }

    const totalAmount = item.totalAmount;
    const isPositive = totalAmount >= 0;

    return (
      <View style={styles.dateHeader}>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <Text
          style={[
            styles.dateTotal,
            { color: isPositive ? COLORS.income : COLORS.expense },
          ]}>
          {isPositive ? "+" : "-"}${Math.abs(totalAmount).toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderTransactionGroup = ({ item }) => (
    <View style={styles.transactionGroup}>
      {renderDateHeader({ item })}
      {item.transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onPress={() => handleTransactionPress(transaction)}
          onLongPress={() => handleDeleteTransaction(transaction.id)}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading transactions</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <PageHeader title="Transactions" />

        {/* Type Filter Section */}
        <View style={styles.filterContainer}>
          {[
            "all",
            TRANSACTION_TYPE.INCOME,
            TRANSACTION_TYPE.EXPENSE,
            TRANSACTION_TYPE.TRANSFER,
          ].map((type) => (
            <Text
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(type)}>
              {type === "all"
                ? "All"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Transaction List */}
          {groupedTransactions.map((group) => (
            <View key={group.date} style={styles.transactionGroup}>
              {renderDateHeader({ item: group })}
              {group.transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                  onLongPress={() => handleDeleteTransaction(transaction.id)}
                />
              ))}
            </View>
          ))}

          {groupedTransactions.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedType !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first transaction to get started"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FloatingActionButton
        onPress={() => setIsModalVisible(true)}
        icon="plus"
      />

      <CreateTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120, // Extra space for bottom tab navigation + FAB
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.input,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    textAlign: "center",
    minWidth: 70,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.expense,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
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
