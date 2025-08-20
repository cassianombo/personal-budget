import { Pressable, StyleSheet, Text, View } from "react-native";
import { TRANSACTION_TYPE, getTransactionTypeInfo } from "../../constants";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

const TransactionItem = ({ transaction, onPress, onLongPress }) => {
  const {
    amount,
    title,
    categoryName,
    type,
    date,
    walletName,
    categoryIcon,
    categoryBackground,
  } = transaction;

  const transactionInfo = getTransactionTypeInfo(type);
  const isTransfer = type === TRANSACTION_TYPE.TRANSFER;

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    const sign = isTransfer ? "" : transactionInfo.sign;
    return `${sign}$${absAmount.toFixed(2)}`;
  };

  const getTransactionIcon = () => {
    if (isTransfer) return "swap";
    if (categoryIcon) return categoryIcon;
    return transactionInfo.icon;
  };

  const getIconBackground = () => {
    if (isTransfer) return COLORS.transfer;
    if (categoryBackground) return categoryBackground;
    return transactionInfo.color;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackground() },
          ]}>
          <Icon name={getTransactionIcon()} size={20} color={COLORS.text} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.metaInfo}>
            {walletName && (
              <Text style={styles.wallet} numberOfLines={1}>
                {walletName}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: transactionInfo.color }]}>
          {formatCurrency(amount)}
        </Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  wallet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
});

export default TransactionItem;
