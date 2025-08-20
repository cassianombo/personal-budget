import { StyleSheet, Text, View } from "react-native";
import { darkenColor, veryDarkColor } from "../../utils/helpers";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const WalletCard = ({
  wallet,
  showTypeBadge = false,
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

  // Obtém a cor da carteira e cria versões mais escuras para o gradiente
  const walletColor = wallet.background || walletTypeInfo?.color;
  const darkWalletColor = walletColor
    ? darkenColor(walletColor, 70)
    : COLORS.card;
  const darkerWalletColor = walletColor
    ? darkenColor(walletColor, 85)
    : COLORS.card;
  const veryDarkWalletColor = walletColor
    ? veryDarkColor(walletColor)
    : COLORS.card;

  return (
    <LinearGradient
      colors={[darkWalletColor, darkerWalletColor, veryDarkWalletColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.walletCard}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            name={wallet.icon || walletTypeInfo?.icon}
            size={24}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{wallet.name}</Text>
          {showTypeBadge && walletTypeInfo && (
            <View style={styles.typeContainer}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: COLORS.walletCash },
                ]}>
                <Text style={styles.typeText}>{walletTypeInfo.label}</Text>
              </View>
            </View>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  walletCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 28,
    borderWidth: 0,
    // Enhanced shadows for better depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    // Enhanced icon container with subtle border
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 6,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  balance: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WalletCard;
