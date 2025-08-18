import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import { Title } from "../UI";

const WalletList = ({ wallets = [], onViewAll }) => {
  // Ensure wallets is an array and has valid data
  const validWallets = Array.isArray(wallets)
    ? wallets.filter((wallet) => wallet && wallet.id)
    : [];
  const maxVisibleWallets = 2;
  const visibleWallets = validWallets.slice(0, maxVisibleWallets);
  const hasMoreWallets = validWallets.length > maxVisibleWallets;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Wallets</Title>
        {hasMoreWallets && (
          <Pressable onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        )}
      </View>

      {visibleWallets.map((wallet, index) => (
        <View key={wallet.id} style={styles.walletsContainer}>
          {index > 0 && <View style={styles.divider} />}
          {/* <WalletItem wallet={wallet} onPress={() => {}} /> */}
        </View>
      ))}

      {hasMoreWallets && (
        <View style={styles.walletsContainer}>
          <View style={styles.divider} />
          <Pressable
            onPress={onViewAll}
            style={({ pressed }) => [
              styles.moreWalletsButton,
              pressed && styles.pressed,
            ]}>
            <View style={styles.moreWalletsContent}>
              <View style={styles.moreIcon}>
                <Icon name="ellipsis1" size={20} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.moreText}>
                View {validWallets.length - maxVisibleWallets} more wallet
                {validWallets.length - maxVisibleWallets !== 1 ? "s" : ""}
              </Text>
              <Icon name="right" size={16} color={COLORS.textSecondary} />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default WalletList;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.card,
  },
  walletsContainer: {
    marginHorizontal: -16,
    marginBottom: -16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 8,
    marginBottom: -8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllButton: {
    padding: 4,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  moreWalletsButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  moreWalletsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  moreText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});
