import { Alert, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  AmountInput,
  Button,
  DatePicker,
  Header,
  SelectedInput,
  TextInput,
  TransactionTypeSelector,
} from "../UI";
import React, { useEffect, useState } from "react";
import {
  useCategories,
  useCreateTransaction,
  useUpdateTransaction,
} from "../../services/useDatabase";

import { COLORS } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateId } from "../../utils/generateId";

const TransactionModal = ({
  visible,
  onClose,
  wallets = [],
  preSelectedWalletId,
  transaction = null, // For editing
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    title: "",
    description: "",
    categoryId: "",
    walletId: preSelectedWalletId || "",
    secondWalletId: "",
    date: new Date().toISOString(),
    type: "expense", // expense, income, transfer
  });

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const { data: categories = [], isLoading, error } = useCategories();

  const isEditing = !!transaction;

  const handleSubmit = async () => {
    // Simple validation - only create if all required fields are filled
    if (!formData.amount || !formData.title.trim() || !formData.walletId) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    // Additional validation for category (required for expense/income)
    if (formData.type !== "transfer" && !formData.categoryId) {
      Alert.alert("Missing Information", "Please select a category");
      return;
    }

    // Additional validation for second wallet (required for transfer)
    if (formData.type === "transfer" && !formData.secondWalletId) {
      Alert.alert("Missing Information", "Please select destination wallet");
      return;
    }

    // Validate amount is greater than 0
    if (parseFloat(formData.amount) <= 0) {
      Alert.alert("Invalid Amount", "Amount must be greater than 0");
      return;
    }

    try {
      const {
        amount,
        title,
        categoryId,
        walletId,
        secondWalletId,
        date,
        type,
      } = formData;

      const transactionData = {
        amount: parseFloat(amount),
        title: title.trim(),
        description: formData.description.trim(),
        categoryId: categoryId || null,
        walletId,
        secondWalletId: secondWalletId || null,
        date,
        type,
      };

      if (isEditing) {
        // Update existing transaction
        await updateTransactionMutation.mutateAsync({
          id: transaction.id,
          ...transactionData,
        });
      } else {
        // Create new transaction
        await createTransactionMutation.mutateAsync({
          id: generateId(),
          ...transactionData,
          createdAt: new Date().toISOString(),
        });
      }

      Alert.alert(
        "Success",
        `Transaction ${isEditing ? "updated" : "created"} successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form and close modal
              setFormData({
                amount: "",
                title: "",
                description: "",
                categoryId: "",
                walletId: "",
                secondWalletId: "",
                date: new Date().toISOString(),
                type: "expense",
              });
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message ||
          `Failed to ${isEditing ? "update" : "create"} transaction`
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Reset second wallet when type changes to non-transfer
    if (field === "type" && value !== "transfer") {
      setFormData((prev) => ({ ...prev, secondWalletId: "" }));
    }
  };

  const getFilteredWallets = () => {
    return wallets.filter((wallet) => wallet.id !== formData.walletId);
  };

  const getFilteredCategories = () => {
    if (formData.type === "transfer") {
      return []; // No categories for transfers
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    return categories.filter((cat) => cat.type === formData.type);
  };

  // Reset form when modal opens/closes or preSelectedWalletId changes
  useEffect(() => {
    if (visible) {
      if (isEditing && transaction) {
        // Populate form with transaction data for editing
        setFormData({
          amount: transaction.amount.toString(),
          title: transaction.title || "",
          description: transaction.description || "",
          categoryId: transaction.categoryId || "",
          walletId: transaction.walletId || "",
          secondWalletId: transaction.secondWalletId || "",
          date: transaction.date || new Date().toISOString(),
          type: transaction.type || "expense",
        });
      } else {
        // Reset form for creating new transaction
        setFormData({
          amount: "",
          title: "",
          description: "",
          categoryId: "",
          walletId: preSelectedWalletId || "",
          secondWalletId: "",
          date: new Date().toISOString(),
          type: "expense",
        });
      }
    }
  }, [visible, preSelectedWalletId, transaction, isEditing]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <Header
          title={isEditing ? "Edit Transaction" : "Create Transaction"}
          onBack={onClose}
          showBackButton={true}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.titleSection}>
            <TextInput
              placeholder="Transaction title"
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
              style={styles.titleInput}
            />
          </View>

          {/* Wallet Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet</Text>
            <SelectedInput
              placeholder="Select wallet"
              value={formData.walletId}
              onSelect={(value) => updateFormData("walletId", value)}
              options={wallets.map((wallet) => ({
                id: wallet.id,
                name: wallet.name,
                icon: wallet.icon,
                background: wallet.background,
              }))}
            />
          </View>

          {/* Transaction Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Type</Text>
            <TransactionTypeSelector
              value={formData.type}
              onSelect={(value) => updateFormData("type", value)}
            />
          </View>

          {/* Amount and Date Row */}
          <View style={styles.rowContainer}>
            <View style={styles.amountContainer}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <AmountInput
                value={formData.amount}
                onChangeText={(value) => updateFormData("amount", value)}
                transactionType={formData.type}
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.sectionTitle}>Date</Text>
              <DatePicker
                value={formData.date}
                onChange={(value) => updateFormData("date", value)}
                maximumDate={new Date()}
                minimumDate={new Date(2020, 0, 1)}
              />
            </View>
          </View>

          {/* Category or Second Wallet */}
          {formData.type !== "transfer" ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <SelectedInput
                placeholder="Select category"
                value={formData.categoryId}
                onSelect={(value) => updateFormData("categoryId", value)}
                options={getFilteredCategories().map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  icon: cat.icon,
                  background: cat.background,
                }))}
              />
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Destination Wallet</Text>
              <SelectedInput
                placeholder="Select destination wallet"
                value={formData.secondWalletId}
                onSelect={(value) => updateFormData("secondWalletId", value)}
                options={getFilteredWallets().map((wallet) => ({
                  id: wallet.id,
                  name: wallet.name,
                  icon: wallet.icon,
                  background: wallet.background,
                }))}
              />
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (optional)</Text>
            <TextInput
              placeholder="Add description"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            title={
              (
                isEditing
                  ? updateTransactionMutation.isPending
                  : createTransactionMutation.isPending
              )
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Transaction"
                : "Create Transaction"
            }
            onPress={handleSubmit}
            disabled={
              isEditing
                ? updateTransactionMutation.isPending
                : createTransactionMutation.isPending
            }
            style={styles.submitButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: "center",
    minHeight: 48,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  amountContainer: {
    flex: 1,
  },
  dateContainer: {
    flex: 1.5,
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    marginTop: 0,
  },
  titleSection: {
    marginBottom: 16,
  },
});

export default TransactionModal;
