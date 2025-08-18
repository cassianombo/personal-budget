import { COLORS } from "./colors";
import { Ionicons } from "@expo/vector-icons";

export const TAB_NAVIGATION = {
  HOME: {
    name: "Home",
    icon: "home",
    iconFocused: "home",
  },
  TRANSACTIONS: {
    name: "Transactions",
    icon: "list",
    iconFocused: "list",
  },
  ANALYSIS: {
    name: "Analysis",
    icon: "analytics",
    iconFocused: "analytics",
  },
  SETTINGS: {
    name: "Settings",
    icon: "settings",
    iconFocused: "settings",
  },
};

export const getTabIcon = (routeName, focused) => {
  const tab = Object.values(TAB_NAVIGATION).find(
    (tab) => tab.name === routeName
  );
  if (!tab) return "help-circle";

  return focused ? tab.iconFocused : tab.icon;
};

export const getTabColor = (focused) => {
  return focused ? COLORS.primary : COLORS.textSecondary;
};
