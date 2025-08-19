import { WalletDetailScreen, WalletsScreen } from "../screens";

import React from "react";
import TabNavigator from "./TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animationEnabled: true,
      }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Wallets"
        component={WalletsScreen}
        options={{
          presentation: "card",
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="WalletDetail"
        component={WalletDetailScreen}
        options={{
          presentation: "card",
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
