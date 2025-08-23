import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Text, View } from "react-native";
import {
  useBackgroundSync,
  useDatabaseInitialization,
} from "./services/useDatabase";

import AppNavigator from "./navigation/AppNavigator";
import { COLORS } from "./constants/colors";
import { NavigationContainer } from "@react-navigation/native";
import { QUERY_CONFIG } from "./services/queryConfig";
import React from "react";
import { StatusBar } from "expo-status-bar";

// Create an optimized QueryClient with centralized configuration
const queryClient = new QueryClient({
  defaultOptions: QUERY_CONFIG,
});

// App content component that uses the database initialization hook
function AppContent() {
  const {
    data: dbInit,
    isLoading: dbLoading,
    error: dbError,
  } = useDatabaseInitialization();

  // ✅ Enable intelligent background sync
  useBackgroundSync();

  // Show loading state while database initializes
  if (dbLoading || !dbInit) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}>
        <Text style={{ color: COLORS.text, fontSize: 18, marginBottom: 20 }}>
          Initializing Database...
        </Text>
      </View>
    );
  }

  // Show error state if database initialization failed
  if (dbError || dbInit?.status === "error") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}>
        <Text style={{ color: COLORS.error, fontSize: 18, marginBottom: 10 }}>
          Database Error
        </Text>
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            textAlign: "center",
            paddingHorizontal: 20,
          }}>
          {dbError?.message || dbInit?.error || "Failed to initialize database"}
        </Text>
      </View>
    );
  }

  // Database is successfully initialized
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
