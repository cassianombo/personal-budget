import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Header } from "../components/UI";
import React, { useState } from "react";

import { COLORS } from "../constants/colors";
import Icon from "../components/UI/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import WalletCard from "../components/Wallet/WalletCard";
import { formatCurrency } from "../utils/helpers";
import { getWalletTypeInfo } from "../constants/Types/walletTypes";
import { useDeleteWallet } from "../services/useDatabase";

const WalletDetailScreen = ({ route, navigation }) => {
  const { wallet } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const deleteWalletMutation = useDeleteWallet();

  const walletTypeInfo = getWalletTypeInfo(wallet.type);

  const handleEditWallet = () => {
    // TODO: Navigate to edit wallet screen
    console.log("Edit wallet:", wallet.id);
  };

  const handleDeleteWallet = () => {
    Alert.alert(
      "Delete Wallet",
      `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`,
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
              await deleteWalletMutation.mutateAsync(wallet.id);
              Alert.alert(
                "Success",
                `Wallet "${wallet.name}" has been deleted successfully.`,
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
    // TODO: Navigate to add transaction screen with wallet pre-selected
    console.log("Add transaction for wallet:", wallet.id);
  };

  const handleViewAllTransactions = () => {
    // TODO: Navigate to transactions screen filtered by this wallet
    console.log("View all transactions for wallet:", wallet.id);
  };

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
            wallet={wallet}
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
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Last Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Avg/Month</Text>
            </View>
          </View>
        </View>

        {/* Wallet Notes */}
        {wallet.description && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{wallet.description}</Text>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          <View style={styles.transactionsList}>
            <View style={styles.emptyTransactions}>
              <View style={styles.emptyIconContainer}>
                <Icon name="filetext1" size={48} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking your spending by adding your first transaction
              </Text>
              <Button
                title="Add Transaction"
                onPress={handleAddTransaction}
                style={styles.emptyButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>

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
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  transactionsList: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.input,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: "italic",
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
