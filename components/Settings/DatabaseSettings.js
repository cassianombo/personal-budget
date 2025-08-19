import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Icon, Title } from "../UI";
import React, { useState } from "react";
import {
  clearDatabase,
  getDatabaseStats,
  seedDatabase,
} from "../../services/databaseSeed";
import {
  useCategories,
  useDatabaseInitialization,
  useTotalBalance,
  useTransactions,
  useWallets,
} from "../../services/useDatabase";

import { COLORS } from "../../constants/colors";

const DatabaseSettings = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const {
    data: dbInit,
    isLoading: dbLoading,
    error: dbError,
  } = useDatabaseInitialization();
  const { data: wallets, refetch: refetchWallets } = useWallets();
  const { data: categories, refetch: refetchCategories } = useCategories();
  const { data: totalBalance, refetch: refetchBalance } = useTotalBalance();
  const { data: transactions, refetch: refetchTransactions } =
    useTransactions();

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        Alert.alert("Success", result.message);
        // Refetch all data
        refetchWallets();
        refetchCategories();
        refetchBalance();
        refetchTransactions();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear all data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              const result = await clearDatabase();
              if (result.success) {
                Alert.alert("Success", result.message);
                // Refetch all data
                refetchWallets();
                refetchCategories();
                refetchBalance();
                refetchTransactions();
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to clear database");
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const showDatabaseStats = async () => {
    try {
      const stats = await getDatabaseStats();
      if (stats) {
        const message = `Version: ${stats.currentVersion}
Categories: ${stats.counts.categories}
Wallets: ${stats.counts.wallets}
Transactions: ${stats.counts.transactions}
Total Balance: $${stats.totalBalance?.toFixed(2) || "0.00"}`;
        Alert.alert("Database Statistics", message);
      } else {
        Alert.alert("Error", "Could not get statistics");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get statistics");
    }
  };

  const getDatabaseStatusText = () => {
    if (dbLoading) return "Initializing...";
    if (dbError) return `Error: ${dbError.message}`;
    if (dbInit?.initialized) return "✅ Operational";
    return "❌ Not initialized";
  };

  const getDatabaseStatusColor = () => {
    if (dbLoading) return COLORS.textSecondary;
    if (dbError || !dbInit?.initialized) return COLORS.error;
    return COLORS.income;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Title style={styles.sectionTitle}>Database</Title>

      {/* Database Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Database Status</Text>
        <Text style={[styles.statusText, { color: getDatabaseStatusColor() }]}>
          {getDatabaseStatusText()}
        </Text>
      </View>

      {/* Data Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{wallets?.length || 0}</Text>
            <Text style={styles.summaryLabel}>Wallets</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{categories?.length || 0}</Text>
            <Text style={styles.summaryLabel}>Categories</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              ${totalBalance?.toFixed(2) || "0.00"}
            </Text>
            <Text style={styles.summaryLabel}>Total Balance</Text>
          </View>
        </View>
      </View>

      {/* Actions Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Database Actions</Text>
        <Text style={styles.cardDescription}>
          Use these options to manage your app data. Be careful with the clear
          data option.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title={isSeeding ? "Seeding..." : "Seed with Sample Data"}
            onPress={handleSeedDatabase}
            disabled={isSeeding || !dbInit?.initialized}
            variant="primary"
            size="medium"
          />

          <Button
            title="View Detailed Statistics"
            onPress={showDatabaseStats}
            disabled={!dbInit?.initialized}
            variant="outline"
            size="medium"
          />

          <Button
            title={isClearing ? "Clearing..." : "Clear All Data"}
            onPress={handleClearDatabase}
            disabled={isClearing || !dbInit?.initialized}
            variant="danger"
            size="medium"
          />
        </View>
      </View>

      {/* Data Preview */}
      {(wallets?.length > 0 ||
        categories?.length > 0 ||
        transactions?.length > 0) && (
        <View style={styles.card}>
          <View style={styles.previewHeader}>
            <Icon name="eye" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Data Preview</Text>
          </View>
          <Text style={styles.cardDescription}>
            Preview of your stored data
          </Text>

          {wallets && wallets.length > 0 && (
            <View style={styles.previewSection}>
              <View style={styles.previewSectionHeader}>
                <Icon name="creditcard" size={16} color={COLORS.primary} />
                <Text style={styles.previewTitle}>
                  Wallets ({wallets.length})
                </Text>
              </View>
              {wallets.slice(0, 4).map((wallet) => (
                <View key={wallet.id} style={styles.previewItemContainer}>
                  <View style={styles.previewItemLeft}>
                    <View
                      style={[
                        styles.previewItemIcon,
                        {
                          backgroundColor: wallet.background || COLORS.primary,
                        },
                      ]}>
                      <Icon
                        name={wallet.icon || "wallet"}
                        size={12}
                        color={COLORS.text}
                      />
                    </View>
                    <View>
                      <Text style={styles.previewItemName}>{wallet.name}</Text>
                      <Text style={styles.previewItemType}>{wallet.type}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.previewItemBalance,
                      {
                        color:
                          wallet.balance >= 0 ? COLORS.income : COLORS.error,
                      },
                    ]}>
                    ${wallet.balance?.toFixed(2)}
                  </Text>
                </View>
              ))}
              {wallets.length > 4 && (
                <Text style={styles.previewMore}>
                  +{wallets.length - 4} more wallets
                </Text>
              )}
            </View>
          )}

          {categories && categories.length > 0 && (
            <View style={styles.previewSection}>
              <View style={styles.previewSectionHeader}>
                <Icon name="tags" size={16} color={COLORS.secondary} />
                <Text style={styles.previewTitle}>
                  Categories ({categories.length})
                </Text>
              </View>
              <View style={styles.categoriesGrid}>
                {categories.slice(0, 6).map((category) => (
                  <View key={category.id} style={styles.categoryChip}>
                    <View
                      style={[
                        styles.categoryChipIcon,
                        {
                          backgroundColor:
                            category.background || COLORS.secondary,
                        },
                      ]}>
                      <Icon
                        name={
                          category.icon ||
                          (category.type === "income" ? "plus" : "minus")
                        }
                        size={10}
                        color={COLORS.text}
                      />
                    </View>
                    <Text style={styles.categoryChipText}>{category.name}</Text>
                    <Text style={styles.categoryChipType}>
                      {category.type === "income" ? "↗" : "↘"}
                    </Text>
                  </View>
                ))}
              </View>
              {categories.length > 6 && (
                <Text style={styles.previewMore}>
                  +{categories.length - 6} more categories
                </Text>
              )}
            </View>
          )}

          {transactions && transactions.length > 0 && (
            <View style={styles.previewSection}>
              <View style={styles.previewSectionHeader}>
                <Icon name="swap" size={16} color={COLORS.accent} />
                <Text style={styles.previewTitle}>
                  Recent Transactions ({transactions.length})
                </Text>
              </View>
              {transactions.slice(0, 3).map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {
                          backgroundColor:
                            transaction.type === "income"
                              ? COLORS.income + "20"
                              : transaction.type === "transfer"
                              ? COLORS.primary + "20"
                              : COLORS.error + "20",
                        },
                      ]}>
                      <Icon
                        name={
                          transaction.type === "income"
                            ? "plus"
                            : transaction.type === "transfer"
                            ? "swap"
                            : "minus"
                        }
                        size={12}
                        color={
                          transaction.type === "income"
                            ? COLORS.income
                            : transaction.type === "transfer"
                            ? COLORS.primary
                            : COLORS.error
                        }
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionTitle}>
                        {transaction.title}
                      </Text>
                      <Text style={styles.transactionDetails}>
                        {transaction.walletName}
                        {transaction.categoryName &&
                          ` • ${transaction.categoryName}`}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === "income"
                            ? COLORS.income
                            : transaction.type === "transfer"
                            ? COLORS.primary
                            : COLORS.error,
                      },
                    ]}>
                    {transaction.type === "income"
                      ? "+"
                      : transaction.type === "transfer"
                      ? "→"
                      : ""}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
              {transactions.length > 3 && (
                <Text style={styles.previewMore}>
                  +{transactions.length - 3} more transactions
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 12,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  previewSection: {
    marginTop: 20,
  },
  previewSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  previewItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  previewItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  previewItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  previewItemType: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  previewItemBalance: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  categoryChipIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  categoryChipType: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  transactionIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  transactionDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  previewMore: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
    paddingVertical: 8,
    backgroundColor: COLORS.background + "80",
    borderRadius: 6,
  },
});

export default DatabaseSettings;
