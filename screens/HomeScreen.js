import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  usePrefetchData,
  useQueryState,
  useSmartRefetch,
  useTotalBalance,
  useWallets,
} from "../services";

import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import FloatingActionButton from "../components/UI/FloatingActionButton";
import NetWorthPanel from "../components/Widgets/NetWorthPanel";
import { PageHeader } from "../components/UI";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionModal from "../components/Transaction/TransactionModal";
import WalletList from "../components/Wallet/WalletList";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
    useState(false);

  const totalBalanceQuery = useTotalBalance();
  const walletsQuery = useWallets();

  // ✅ Prefetch data for better UX
  const { prefetchAll } = usePrefetchData();

  // Use optimized query state management
  const { isLoading, isError, error } = useQueryState([
    totalBalanceQuery,
    walletsQuery,
  ]);

  // ✅ Smart refetch - only refetch if data is stale
  const smartRefetchWallets = useSmartRefetch(walletsQuery);

  // ✅ Prefetch data when component mounts
  useEffect(() => {
    prefetchAll();
  }, [prefetchAll]);

  // Force refetch when screen comes into focus ONLY if data is stale
  useFocusEffect(
    React.useCallback(() => {
      // ✅ Only refetch if data is stale and not currently fetching
      if (walletsQuery.isStale && !walletsQuery.isFetching) {
        smartRefetchWallets();
      }
    }, [walletsQuery.isStale, walletsQuery.isFetching, smartRefetchWallets])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorSubtext}>
          {error?.message || "Please try again later"}
        </Text>
      </SafeAreaView>
    );
  }

  const totalBalance = totalBalanceQuery.data || 0;
  const wallets = walletsQuery.data || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <PageHeader
          title="Home"
          subtitle="Welcome to your Personal Budget App"
        />

        <NetWorthPanel value={totalBalance} totalWallets={wallets.length} />

        <WalletList
          wallets={wallets}
          isLoading={walletsQuery.isLoading}
          onViewAll={() => navigation.navigate("Wallets")}
          onWalletPress={(wallet) =>
            navigation.navigate("WalletDetail", { wallet })
          }
        />
      </ScrollView>

      {/* Floating Action Button for creating transactions */}
      <FloatingActionButton
        onPress={() => setIsCreateTransactionModalVisible(true)}
        icon="plus"
        size={24}
        backgroundColor={COLORS.primary}
        iconColor="#FFFFFF"
      />

      {/* Create Transaction Modal */}
      <TransactionModal
        visible={isCreateTransactionModalVisible}
        onClose={() => setIsCreateTransactionModalVisible(false)}
        wallets={wallets}
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
  centered: {
    alignItems: "center",
    justifyContent: "center",
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
