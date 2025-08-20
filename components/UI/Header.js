import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { HeaderButton } from "./index";
import React from "react";

const Header = ({
  title,
  onBack,
  actions = [],
  showBackButton = true,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.header, style]}>
      {/* Left side - Back button or placeholder */}
      <View style={styles.leftSide}>
        {showBackButton ? (
          <HeaderButton variant="back" onPress={onBack} />
        ) : null}
      </View>

      {/* Center - Title (always centered) */}
      <View style={styles.headerContent}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>

      {/* Right side - Action buttons */}
      <View style={styles.rightSide}>
        {actions.map((action, index) => (
          <HeaderButton
            key={index}
            variant={action.variant}
            icon={action.icon}
            onPress={action.onPress}
            style={action.style}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    position: "relative",
  },
  leftSide: {
    width: 40,
    zIndex: 1,
  },
  headerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  rightSide: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
    zIndex: 1,
  },
});
export default Header;
