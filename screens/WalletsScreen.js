import {
  ActivityIndicator,
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
import WalletItem from "../components/Wallet/WalletItem";
import { WalletModal } from "../components/Wallet";
import { formatCurrency } from "../utils/helpers";
import { useFocusEffect } from "@react-navigation/native";

// Database hooks removed - no longer using local database

const WalletsScreen = ({ navigation }) => {
  // Placeholder data - database functionality removed
  const wallets = [];
  const isLoading = false;
  const error = null;
  const refetch = () => {};

  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  // Placeholder function - database functionality removed
  const deleteWalletMutation = {
    mutateAsync: async () => {
      throw new Error("Database functionality removed");
    },
    isPending: false,
  };

  // Placeholder function - database functionality removed
  const smartRefetch = () => {};

  // Force refetch when screen comes into focus ONLY if data is stale
  useFocusEffect(
    React.useCallback(() => {
      // ✅ Only refetch if data is stale and not currently fetching
      if (smartRefetch && !isLoading) {
        smartRefetch();
      }
    }, [smartRefetch, isLoading])
  );

  const totalBalance = wallets.reduce(
    (sum, wallet) => sum + (wallet.balance || 0),
    0
  );
  const positiveWallets = wallets.filter((wallet) => wallet.balance > 0).length;
  const negativeWallets = wallets.filter((wallet) => wallet.balance < 0).length;

  const handleAddWallet = () => {
    setShowAddWalletModal(true);
  };

  const handleDeleteWallet = async (walletId) => {
    try {
      await deleteWalletMutation.mutateAsync(walletId);
      // The query will automatically refresh due to the mutation
    } catch (error) {
      // Show user-friendly error message
      let errorMessage = "Failed to delete wallet. Please try again.";

      if (error.message === "Cannot delete wallet with existing transactions") {
        errorMessage =
          "Cannot delete wallet that has transactions. Please delete all transactions first or transfer them to another wallet.";
      } else if (error.message === "Wallet not found") {
        errorMessage = "Wallet not found. It may have been deleted already.";
      }

      Alert.alert("Error", errorMessage);
      console.error("Failed to delete wallet:", error);
    }
  };

  const handleEditWallet = (wallet) => {
    // TODO: Navigate to edit wallet screen
    console.log("Edit wallet:", wallet.id);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Wallets" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading wallets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Wallets" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Icon name="exclamationcircle" size={48} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error Loading Wallets</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          <Button title="Retry" onPress={refetch} style={styles.retryButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Wallets"
        onBack={() => navigation.goBack()}
        actions={[{ variant: "add", onPress: handleAddWallet }]}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Total Balance</Text>
              <Icon name="wallet" size={20} color={COLORS.primary} />
            </View>
            <Text
              style={[
                styles.summaryAmount,
                { color: totalBalance >= 0 ? COLORS.income : COLORS.error },
              ]}>
              {formatCurrency(totalBalance)}
            </Text>

            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wallets.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: COLORS.income }]}>
                  {positiveWallets}
                </Text>
                <Text style={styles.statLabel}>Positive</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: COLORS.error }]}>
                  {negativeWallets}
                </Text>
                <Text style={styles.statLabel}>Negative</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wallets List */}
        <View style={styles.walletsSection}>
          <Text style={styles.sectionTitle}>
            All Wallets ({wallets.length})
          </Text>

          {wallets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Icon name="wallet" size={48} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Wallets Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first wallet to start tracking your finances
              </Text>
              <Button
                title="Add Wallet"
                onPress={handleAddWallet}
                style={styles.emptyButton}
              />
            </View>
          ) : (
            <View style={styles.walletsList}>
              {wallets.map((wallet, index) => (
                <View key={wallet.id}>
                  <WalletItem
                    wallet={wallet}
                    onPress={() =>
                      navigation.navigate("WalletDetail", { wallet })
                    }
                    onDelete={() => handleDeleteWallet(wallet.id)}
                    onEdit={() => handleEditWallet(wallet)}
                  />

                  {index < wallets.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Wallet Modal */}
      <WalletModal
        visible={showAddWalletModal}
        onClose={() => setShowAddWalletModal(false)}
      />
    </SafeAreaView>
  );
};

export default WalletsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  walletsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  walletsList: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 0,
  },
  emptyContainer: {
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
});
