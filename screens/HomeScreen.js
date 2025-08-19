import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTotalBalance, useWallets } from "../services/useDatabase";

import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import NetWorthPanel from "../components/Widgets/NetWorthPanel";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WalletList from "../components/Wallet/WalletList";

export default function HomeScreen({ navigation }) {
  const {
    data: totalBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useTotalBalance();
  const {
    data: wallets,
    isLoading: walletsLoading,
    error: walletsError,
  } = useWallets();

  const isLoading = balanceLoading || walletsLoading;
  const hasError = balanceError || walletsError;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorSubtext}>
          {balanceError?.message ||
            walletsError?.message ||
            "Please try again later"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Welcome to your Personal Budget</Text>
        </View>

        <NetWorthPanel
          value={totalBalance || 0}
          totalWallets={wallets?.length || 0}
        />

        <WalletList
          wallets={wallets || []}
          isLoading={walletsLoading}
          onViewAll={() => navigation.navigate("Wallets")}
          onWalletPress={(wallet) =>
            console.log(
              "Wallet selected:",
              wallet.name,
              "Balance:",
              wallet.balance
            )
          }
        />
      </ScrollView>
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
    paddingBottom: 100, // Extra space for bottom tab navigation
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  quickStats: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
