import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";
import { Swipeable } from "react-native-gesture-handler";
import { formatCurrency } from "../../utils/helpers";

const WalletItem = ({ wallet, onPress, onDelete, onEdit }) => {
  const getBalanceColor = (balance) => {
    if (balance > 0) return COLORS.income;
    if (balance < 0) return COLORS.error;
    return COLORS.text;
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Wallet",
      `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete && onDelete(wallet.id),
        },
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <View style={styles.swipeActions}>
        {onEdit && (
          <Pressable
            style={[styles.swipeAction, styles.editAction]}
            onPress={() => onEdit(wallet)}>
            <Icon name="edit" size={20} color={COLORS.text} />
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            style={[styles.swipeAction, styles.deleteAction]}
            onPress={handleDelete}>
            <Icon name="delete" size={20} color={COLORS.text} />
          </Pressable>
        )}
      </View>
    );
  };

  const walletContent = (
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

  // If no swipe actions, return regular content
  if (!onDelete && !onEdit) {
    return walletContent;
  }

  // Return swipeable content
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}>
      {walletContent}
    </Swipeable>
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
  },
  walletType: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 20,
  },
  swipeAction: {
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 12,
  },
  editAction: {
    backgroundColor: COLORS.primary,
  },
  deleteAction: {
    backgroundColor: COLORS.error,
  },
});
