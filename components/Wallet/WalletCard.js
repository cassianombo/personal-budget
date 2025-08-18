import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

const WalletCard = ({ wallet, onPress }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.walletCard, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={wallet.icon} size={24} color={wallet.background} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{wallet.name}</Text>
          <Text style={styles.balance}>{formatCurrency(wallet.balance)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  walletCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: COLORS.input,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  balance: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
});

export default WalletCard;
