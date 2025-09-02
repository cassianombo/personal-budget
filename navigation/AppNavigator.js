import { ActivityIndicator, StyleSheet, View } from "react-native";
import { LoginScreen, WalletDetailScreen, WalletsScreen } from "../screens";

import React from "react";
import TabNavigator from "./TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tela de loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f3460" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animationEnabled: true,
      }}>
      {isAuthenticated ? (
        // Usuário autenticado - mostrar app principal
        <>
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
        </>
      ) : (
        // Usuário não autenticado - mostrar tela de login
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            presentation: "card",
            animationEnabled: true,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
});
