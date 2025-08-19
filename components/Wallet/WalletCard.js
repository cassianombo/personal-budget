import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

const WalletCard = ({
  wallet,
  showTypeBadge = false,
  showBalanceLabel = false,
  walletTypeInfo = null,
  formatCurrency = null,
}) => {
  const defaultFormatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const currencyFormatter = formatCurrency || defaultFormatCurrency;

  return (
    <View style={styles.walletCard}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            name={wallet.icon || walletTypeInfo?.icon}
            size={24}
            color={wallet.background || walletTypeInfo?.color}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{wallet.name}</Text>
          {showTypeBadge && walletTypeInfo && (
            <View style={styles.typeContainer}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: walletTypeInfo.color },
                ]}>
                <Text style={styles.typeText}>{walletTypeInfo.label}</Text>
              </View>
            </View>
          )}
          {showBalanceLabel && (
            <Text style={styles.balanceLabel}>Current Balance</Text>
          )}
          <Text
            style={[
              styles.balance,
              { color: wallet.balance >= 0 ? COLORS.income : COLORS.expense },
            ]}>
            {currencyFormatter(wallet.balance)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  walletCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.input,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  balance: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
  },
});

export default WalletCard;
