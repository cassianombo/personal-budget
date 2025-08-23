import { StyleSheet, Text, View } from "react-native";

import React from "react";
import { useTheme } from "../../hooks/useTheme";

const NetWorthPanel = ({ value, totalWallets = 0 }) => {
  const { presets, colors } = useTheme();

  // Fallback styles in case theme is not working
  const fallbackStyles = {
    container: {
      backgroundColor: "#1A1A2E",
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 12,
      color: "#A0AEC0",
      marginBottom: 16,
    },
    balanceText: {
      fontSize: 30,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 16,
    },
    statsContainer: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#2D3748",
      alignItems: "center",
    },
    accountInfo: {
      fontSize: 12,
      color: "#A0AEC0",
      fontWeight: "500",
    },
  };

  return (
    <View
      style={[
        presets.card?.base || fallbackStyles.container,
        styles.container,
      ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            style={[presets.text?.h4 || fallbackStyles.title, styles.title]}>
            Net Worth
          </Text>
          <Text
            style={[
              presets.text?.caption || fallbackStyles.subtitle,
              styles.subtitle,
            ]}>
            Total balance across all accounts
          </Text>
        </View>
      </View>

      <Text
        style={[
          presets.text?.amountLarge || fallbackStyles.balanceText,
          styles.balanceText,
        ]}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
        }).format(value || 0)}
      </Text>

      <View style={styles.statsContainer}>
        <Text
          style={[
            presets.text?.caption || fallbackStyles.accountInfo,
            styles.accountInfo,
          ]}>
          {totalWallets} {totalWallets === 1 ? "account" : "accounts"}
        </Text>
      </View>
    </View>
  );
};

export default NetWorthPanel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    // Using presets.text.caption from theme
  },
  balanceText: {
    marginBottom: 16,
  },
  statsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2D3748", // border.primary color
    alignItems: "center",
  },
  accountInfo: {
    fontWeight: "500",
  },
});
