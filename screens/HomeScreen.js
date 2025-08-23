import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useTotalBalance, useWallets } from "../services/useDatabase";

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

  const {
    data: totalBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useTotalBalance();
  const {
    data: wallets,
    isLoading: walletsLoading,
    error: walletsError,
    refetch: refetchWallets,
  } = useWallets();

  // Force refetch when screen comes into focus to get updated data
  useFocusEffect(
    React.useCallback(() => {
      // Small delay to ensure navigation is complete
      const timer = setTimeout(() => {
        refetchWallets();
      }, 100);

      return () => clearTimeout(timer);
    }, [refetchWallets])
  );

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
        <PageHeader
          title="Home"
          subtitle="Welcome to your Personal Budget App"
        />

        <NetWorthPanel
          value={totalBalance || 0}
          totalWallets={wallets?.length || 0}
        />

        <WalletList
          wallets={wallets || []}
          isLoading={walletsLoading}
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
        wallets={wallets || []}
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
