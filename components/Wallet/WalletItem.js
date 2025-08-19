import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";
import { formatCurrency } from "../../utils/helpers";

const WalletItem = ({ wallet, onPress }) => {
  const getBalanceColor = (balance) => {
    if (balance > 0) return COLORS.income;
    if (balance < 0) return COLORS.error;
    return COLORS.text;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        onPress && pressed && styles.pressed,
      ]}
      accessibilityRole={onPress ? "button" : "none"}
      accessibilityLabel={
        onPress
          ? `${wallet.name} wallet with balance ${formatCurrency(
              wallet.balance
            )}`
          : undefined
      }>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: wallet.background || COLORS.primary + "15" },
            ]}>
            <Icon
              name={wallet.icon || "wallet"}
              size={20}
              color={COLORS.text}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.walletName} numberOfLines={1}>
              {wallet.name}
            </Text>
            <Text style={styles.walletType} numberOfLines={1}>
              {wallet.type}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.balanceText,
            { color: getBalanceColor(wallet.balance) },
          ]}
          numberOfLines={1}>
          {formatCurrency(wallet.balance)}
        </Text>
      </View>
    </Pressable>
  );
};

export default WalletItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 0,
    marginVertical: 0,
  },
  pressed: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  walletType: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
    fontWeight: "400",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    letterSpacing: -0.2,
  },
});
