import { Animated, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import React from "react";
import WalletItem from "./WalletItem";

const WalletPreview = ({ wallet, animation, responsive }) => {
  return (
    <View style={[styles.previewSection, { marginBottom: responsive.spacing }]}>
      <Text style={styles.sectionTitle}>Preview</Text>
      <View style={styles.previewContainer}>
        <Animated.View
          style={{
            transform: [{ scale: animation }],
          }}>
          <WalletItem wallet={wallet} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  previewContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default WalletPreview;
