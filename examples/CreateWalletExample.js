import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import { COLORS } from "../constants/colors";
import { generateId } from "../utils/generateId";
import { useCreateWallet } from "../services/useDatabase";

const CreateWalletExample = () => {
  const [walletName, setWalletName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const createWallet = useCreateWallet();

  const handleCreateWallet = () => {
    if (!walletName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a carteira");
      return;
    }

    const walletData = {
      id: generateId(), // ✅ Using our custom ID generator
      name: walletName.trim(),
      balance: parseFloat(initialBalance) || 0,
      icon: "credit-card",
      background: "#4ECDC4",
      type: "debit",
    };

    createWallet.mutate(walletData, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Carteira criada com sucesso!");
        setWalletName("");
        setInitialBalance("");
      },
      onError: (error) => {
        Alert.alert("Erro", `Falhou ao criar carteira: ${error.message}`);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Carteira</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da carteira"
        placeholderTextColor={COLORS.textSecondary}
        value={walletName}
        onChangeText={setWalletName}
      />

      <TextInput
        style={styles.input}
        placeholder="Saldo inicial (opcional)"
        placeholderTextColor={COLORS.textSecondary}
        value={initialBalance}
        onChangeText={setInitialBalance}
        keyboardType="numeric"
      />

      <Button
        title={createWallet.isLoading ? "A criar..." : "Criar Carteira"}
        onPress={handleCreateWallet}
        disabled={createWallet.isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
});

export default CreateWalletExample;
