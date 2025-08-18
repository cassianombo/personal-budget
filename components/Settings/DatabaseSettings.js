import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Title } from "../UI";
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
      {(wallets?.length > 0 || categories?.length > 0) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Preview</Text>

          {wallets && wallets.length > 0 && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Wallets</Text>
              {wallets.slice(0, 3).map((wallet) => (
                <Text key={wallet.id} style={styles.previewItem}>
                  • {wallet.name}: ${wallet.balance?.toFixed(2)}
                </Text>
              ))}
              {wallets.length > 3 && (
                <Text style={styles.previewMore}>
                  +{wallets.length - 3} more...
                </Text>
              )}
            </View>
          )}

          {categories && categories.length > 0 && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Categories</Text>
              {categories.slice(0, 3).map((category) => (
                <Text key={category.id} style={styles.previewItem}>
                  • {category.name} ({category.type})
                </Text>
              ))}
              {categories.length > 3 && (
                <Text style={styles.previewMore}>
                  +{categories.length - 3} more...
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
  previewSection: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  previewItem: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
  },
  previewMore: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
    paddingLeft: 8,
  },
});

export default DatabaseSettings;
