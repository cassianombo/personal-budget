import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingActionButton, PageHeader } from "../components/UI";
import {
  TransactionDetailModal,
  TransactionItem,
  TransactionModal,
} from "../components/Transaction";
import { useCallback, useMemo, useState } from "react";

import { COLORS } from "../constants/colors";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TRANSACTION_TYPE } from "../constants/Types/transactionTypes";
import { useAccounts } from "../services/api/hooks/useAccounts";
import { useFocusEffect } from "@react-navigation/native";
import { useTransactions } from "../services/api/hooks/useTransactions";

export default function TransactionsScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Use the transactions hook
  const { transactionsQuery, deleteTransaction } = useTransactions();

  // Use the accounts hook
  const { accountsQuery } = useAccounts();

  // Extract data from queries
  const transactions = Array.isArray(transactionsQuery.data.data)
    ? transactionsQuery.data.data
    : [];
  const isLoading = transactionsQuery.isLoading;
  const error = transactionsQuery.error;
  const refetch = transactionsQuery.refetch;

  const wallets = accountsQuery.data ? accountsQuery.data : [];

  // Smart refetch function
  const smartRefetch = useCallback(async () => {
    if (transactionsQuery.isStale && !isLoading) {
      await refetch();
    }
  }, [transactionsQuery.isStale, isLoading, refetch]);

  // Force refetch when screen comes into focus ONLY if data is stale
  useFocusEffect(
    React.useCallback(() => {
      // ✅ Only refetch if data is stale and not currently fetching
      if (smartRefetch && !isLoading) {
        smartRefetch();
      }
    }, [smartRefetch, isLoading])
  );

  const handleRefresh = async () => {
    // ✅ Only refetch if data is stale
    if (smartRefetch) {
      await smartRefetch();
    }
  };

  // Filter transactions based on selected type
  const filteredTransactions = useMemo(() => {
    let filtered = transactions || [];

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
          onPress: () => deleteTransaction.mutate(transactionId),
        },
      ]
    );
  };

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalVisible(true);
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
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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

      <FloatingActionButton
        onPress={() => setIsModalVisible(true)}
        icon="plus"
      />

      <TransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        wallets={wallets || []}
      />

      <TransactionDetailModal
        visible={isDetailModalVisible}
        transaction={selectedTransaction}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        onEdit={(transaction) => {
          setIsDetailModalVisible(false);
          setSelectedTransaction(null);
          setEditingTransaction(transaction);
          setIsEditModalVisible(true);
        }}
      />

      <TransactionModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTransaction(null);
        }}
        wallets={wallets || []}
        transaction={editingTransaction}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Extra space for bottom tab navigation + FAB
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
