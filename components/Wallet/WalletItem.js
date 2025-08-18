import { Pressable, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import { StyleSheet } from "react-native";
import { formatCurrency } from "../../utils/helpers";

const WalletItem = ({ wallet, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: wallet.background },
          ]}>
          <Icon name={wallet.icon} size={24} color={COLORS.text} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletType}>{wallet.type}</Text>
          </View>

          <Text style={styles.balanceText}>
            {formatCurrency(wallet.balance)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default WalletItem;

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "transparent",
    marginVertical: 4,
    borderRadius: 16,
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: COLORS.balance,
  },
});
