import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";

const NetWorthPanel = ({ value, totalWallets = 0 }) => {
  return (
    <View style={[styles.container, styles.card]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Net Worth</Text>
          <Text style={styles.subtitle}>Total balance across all accounts</Text>
        </View>
      </View>

      <Text style={styles.balanceText}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
        }).format(value || 0)}
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.accountInfo}>
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
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  statsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
  },
  accountInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});
