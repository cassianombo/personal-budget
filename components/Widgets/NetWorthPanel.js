import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { Title } from "../UI";

const NetWorthPanel = ({ value, totalWallets = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Net Worth</Title>
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
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    alignSelf: "stretch",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  changeContainer: {
    marginBottom: 12,
  },
  changeText: {
    fontSize: 14,
    color: COLORS.income,
    fontWeight: "500",
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
