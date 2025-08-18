import {
  AnalysisScreen,
  HomeScreen,
  SettingsScreen,
  TransactionsScreen,
} from "../screens";
import {
  TAB_NAVIGATION,
  getTabColor,
  getTabIcon,
} from "../constants/navigation";

import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name={TAB_NAVIGATION.HOME.name}
        component={HomeScreen}
        options={{
          title: TAB_NAVIGATION.HOME.name,
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={TAB_NAVIGATION.TRANSACTIONS.name}
        component={TransactionsScreen}
        options={{
          title: TAB_NAVIGATION.TRANSACTIONS.name,
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={TAB_NAVIGATION.ANALYSIS.name}
        component={AnalysisScreen}
        options={{
          title: TAB_NAVIGATION.ANALYSIS.name,
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={TAB_NAVIGATION.SETTINGS.name}
        component={SettingsScreen}
        options={{
          title: TAB_NAVIGATION.SETTINGS.name,
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}
