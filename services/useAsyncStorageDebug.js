import { useCallback, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorageDebug = () => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const debugAllData = useCallback(async () => {
    try {
      setLoading(true);

      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      console.log("🔑 AsyncStorage Keys:", keys);

      // Get all data
      const data = {};
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        try {
          // Try to parse JSON
          data[key] = JSON.parse(value);
        } catch {
          // If not JSON, keep as string
          data[key] = value;
        }
      }

      console.log("📊 AsyncStorage Data:", data);
      setDebugData(data);

      return { keys, data };
    } catch (error) {
      console.error("❌ Debug error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      console.log("🗑️ All AsyncStorage data cleared");
      setDebugData(null);
    } catch (error) {
      console.error("❌ Clear error:", error);
      throw error;
    }
  }, []);

  const getSpecificKey = useCallback(async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      console.log(`🔍 Key "${key}":`, value);
      return value;
    } catch (error) {
      console.error(`❌ Error getting key "${key}":`, error);
      throw error;
    }
  }, []);

  return {
    debugData,
    loading,
    debugAllData,
    clearAllData,
    getSpecificKey,
  };
};
