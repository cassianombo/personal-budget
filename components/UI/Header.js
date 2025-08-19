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
      {showBackButton ? (
        <HeaderButton variant="back" onPress={onBack} />
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center - Title */}
      <View style={styles.headerContent}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>

      {/* Right side - Action buttons */}
      {actions.length > 0 ? (
        <View style={styles.headerActions}>
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
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  placeholder: {
    width: 40,
  },
});

export default Header;
