import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";
import WalletItem from "./WalletItem";

const WalletList = ({
  wallets = [],
  onViewAll,
  onWalletPress,
  isLoading = false,
  showHeader = true,
}) => {
  const maxVisible = 2;
  const validWallets = Array.isArray(wallets)
    ? wallets.filter((wallet) => wallet && wallet.id)
    : [];

  const visibleWallets = validWallets.slice(0, maxVisible);
  const hasMoreWallets = validWallets.length > maxVisible;
  const remainingCount = validWallets.length - maxVisible;

  const handleWalletPress = (wallet) => {
    if (onWalletPress) {
      onWalletPress(wallet);
    } else {
      console.log("Wallet pressed:", wallet.name);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <Text style={styles.title}>Wallets</Text>
          </View>
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.textSecondary} />
        </View>
      </View>
    );
  }

  // Empty state
  if (validWallets.length === 0) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <Text style={styles.title}>Wallets</Text>
            <Pressable onPress={onViewAll} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No wallets added yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>Wallets</Text>

          <Pressable onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.walletsList}>
        {visibleWallets.map((wallet, index) => (
          <View key={wallet.id}>
            <WalletItem
              wallet={wallet}
              onPress={() => handleWalletPress(wallet)}
            />
            {index < visibleWallets.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}

        {hasMoreWallets && (
          <>
            <View style={styles.separator} />
            <Pressable
              onPress={onViewAll}
              style={({ pressed }) => [
                styles.moreButton,
                pressed && styles.moreButtonPressed,
              ]}>
              <Text style={styles.moreButtonText}>
                View more {remainingCount} wallet
                {remainingCount !== 1 ? "s" : ""}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default WalletList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginVertical: 8,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  walletsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 0,
  },
  // Loading state
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  // Empty state
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  // More button
  moreButton: {
    paddingTop: 16,
    alignItems: "center",
  },
  moreButtonPressed: {
    opacity: 0.6,
  },
  moreButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});
