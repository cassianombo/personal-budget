import { COLORS } from "./constants/colors";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./navigation/TabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <TabNavigator />
    </NavigationContainer>
  );
}
