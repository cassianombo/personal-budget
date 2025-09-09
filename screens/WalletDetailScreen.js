import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, FloatingActionButton, Header } from "../components/UI";
import React, { useMemo, useState } from "react";
import {
  TransactionDetailModal,
  TransactionModal,
} from "../components/Transaction";
import { WalletCard, WalletModal } from "../components/Wallet";

import { COLORS } from "../constants/colors";
import Icon from "../components/UI/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionList } from "../components/Transaction";
import { formatCurrency } from "../utils/helpers";
import { getWalletTypeInfo } from "../constants/Types/walletTypes";
import { useFocusEffect } from "@react-navigation/native";

// Database hooks removed - no longer using local database

const WalletDetailScreen = ({ route, navigation }) => {
  const { wallet: initialWallet } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
    useState(false);
  const [isEditWalletModalVisible, setIsEditWalletModalVisible] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditTransactionModalVisible, setIsEditTransactionModalVisible] =
    useState(false);
  // Placeholder functions - database functionality removed
  const deleteWalletMutation = {
    mutateAsync: async () => {
      throw new Error("Database functionality removed");
    },
    isPending: false,
  };

  // Placeholder data - database functionality removed
  const allWallets = [];
  const refetchWallets = () => {};
  const currentWallet = initialWallet;
  const walletLoading = false;
  const smartRefetchWallets = () => {};

  const transactions = [];
  const transactionsLoading = false;
  const transactionsError = null;

  // Force refetch when screen comes into focus ONLY if data is stale
  useFocusEffect(
    React.useCallback(() => {
      // ✅ Only refetch if data is stale and not currently fetching
      if (smartRefetchWallets && !transactionsLoading && !walletLoading) {
        smartRefetchWallets();
      }
    }, [smartRefetchWallets, transactionsLoading, walletLoading])
  );

  const walletTypeInfo = getWalletTypeInfo(currentWallet.type);

  const handleEditWallet = () => {
    setIsEditWalletModalVisible(true);
  };

  const handleWalletUpdated = () => {
    // ✅ Cache is already updated by the mutation, no need to refetch
    // The component will automatically re-render with updated data
  };

  const handleDeleteWallet = () => {
    Alert.alert(
      "Delete Wallet",
      `Are you sure you want to delete "${currentWallet.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteWalletMutation.mutateAsync(currentWallet.id);
              Alert.alert(
                "Success",
                `Wallet "${currentWallet.name}" has been deleted successfully.`,
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              let errorMessage = "Failed to delete wallet. Please try again.";

              // Handle specific database errors
              if (
                error.message ===
                "Cannot delete wallet with existing transactions"
              ) {
                errorMessage =
                  "Cannot delete wallet that has transactions. Please delete all transactions first or transfer them to another wallet.";
              } else if (error.message === "Wallet not found") {
                errorMessage =
                  "Wallet not found. It may have been deleted already.";
              }

              Alert.alert("Error", errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddTransaction = () => {
    setIsCreateTransactionModalVisible(true);
  };

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalVisible(true);
  };

  const handleTransactionLongPress = (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement delete transaction functionality
            console.log("Delete transaction:", transactionId);
          },
        },
      ]
    );
  };

  // Calculate wallet statistics
  const walletStats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const thisYearTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === thisYear;
    });

    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const lastMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    return {
      thisYear: thisYearTransactions.length,
      thisMonth: thisMonthTransactions.length,
      lastMonth: lastMonthTransactions.length,
    };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Wallet Details"
        onBack={() => navigation.goBack()}
        actions={[
          { variant: "edit", onPress: handleEditWallet },
          { variant: "delete", onPress: handleDeleteWallet },
        ]}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Overview Card */}
        <View style={styles.walletCardContainer}>
          <WalletCard
            wallet={currentWallet}
            walletTypeInfo={walletTypeInfo}
            showTypeBadge={true}
            showBalanceLabel={true}
            formatCurrency={formatCurrency}
            onPress={() => {}} // No action needed for this view
          />
        </View>

        {/* Wallet Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{walletStats.thisYear}</Text>
              <Text style={styles.statLabel}>This Year</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{walletStats.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{walletStats.lastMonth}</Text>
              <Text style={styles.statLabel}>Last Month</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>

          <View style={styles.transactionsList}>
            {transactionsLoading ? (
              <View style={styles.loadingTransactions}>
                <Text style={styles.loadingText}>Loading transactions...</Text>
              </View>
            ) : transactionsError ? (
              <View style={styles.errorTransactions}>
                <Text style={styles.errorText}>Error loading transactions</Text>
                <Text style={styles.errorSubtext}>
                  {transactionsError.message}
                </Text>
              </View>
            ) : (
              <TransactionList
                transactions={transactions}
                onTransactionPress={handleTransactionPress}
                onTransactionLongPress={handleTransactionLongPress}
                showDateHeaders={true}
                showEmptyState={true}
                emptyStateTitle="No Transactions Yet"
                emptyStateSubtitle="Start tracking your spending by adding your first transaction"
                style={styles.transactionListStyle}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button for adding transactions */}
      <FloatingActionButton onPress={handleAddTransaction} icon="plus" />

      {/* Wallet Modal */}
      <WalletModal
        visible={isEditWalletModalVisible}
        onClose={() => setIsEditWalletModalVisible(false)}
        wallet={currentWallet}
        onWalletUpdated={handleWalletUpdated}
      />

      {/* Transaction Detail Modal */}
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
          setIsEditTransactionModalVisible(true);
        }}
      />

      {/* Create Transaction Modal */}
      <TransactionModal
        visible={isCreateTransactionModalVisible}
        onClose={() => setIsCreateTransactionModalVisible(false)}
        wallets={allWallets}
        preSelectedWalletId={currentWallet.id}
      />

      {/* Edit Transaction Modal */}
      <TransactionModal
        visible={isEditTransactionModalVisible}
        onClose={() => {
          setIsEditTransactionModalVisible(false);
          setEditingTransaction(null);
        }}
        wallets={allWallets}
        transaction={editingTransaction}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>Deleting wallet...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40, // Extra space at the bottom
  },
  walletCardContainer: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.2,
  },

  statsSection: {
    marginBottom: 20,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 70,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 13,
  },
  transactionsSection: {
    marginBottom: 24,
    marginTop: 8, // Add some top margin for better separation
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  transactionsList: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  loadingTransactions: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorTransactions: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.expense,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  transactionListStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
});

export default WalletDetailScreen;
