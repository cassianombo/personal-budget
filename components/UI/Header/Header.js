import { Dimensions, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import HeaderButton from "./HeaderButton";
import React from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive sizing based on screen dimensions
const getResponsiveSize = (baseSize, scale = 1) => {
  const scaleFactor = Math.min(screenWidth / 375, screenHeight / 812); // Base on iPhone X dimensions

  // Special handling for iPhone 16 Plus and similar medium screens
  if (screenHeight >= 800 && screenHeight < 900) {
    // Medium screens (iPhone 16 Plus) - slightly larger than base
    return baseSize * 1.05;
  }

  // For smaller screens, make elements smaller; for larger screens, make them slightly smaller too
  const adjustedSize = baseSize * scaleFactor * scale;
  // Ensure minimum and maximum bounds for readability
  // Cap at 110% for larger screens to keep text readable
  return Math.max(Math.min(adjustedSize, baseSize * 1.1), baseSize * 0.7);
};

const Header = ({
  title,
  onBack,
  actions = [],
  showBackButton = true,
  style,
  titleStyle,
}) => {
  // Calculate dynamic title size
  const dynamicTitleSize = getResponsiveSize(17);

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
        <Text
          style={[styles.title, titleStyle, { fontSize: dynamicTitleSize }]}>
          {title}
        </Text>
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
