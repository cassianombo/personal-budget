// Expo
import * as Haptics from "expo-haptics";

// React Native
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// Components
import { AmountInput, Button, Header, TextInput } from "../UI";
// React
import React, { useCallback, useMemo, useRef } from "react";

// Constants
import { COLORS } from "../../constants/colors";
import ColorSelector from "./ColorSelector";
import IconSelector from "./IconSelector";
import { SafeAreaView } from "react-native-safe-area-context";
import TypeSelector from "./TypeSelector";
import WalletPreview from "./WalletPreview";
// Hooks
import { useAccounts } from "../../services/api/hooks";
import { useSettings } from "../../services/api/hooks";
import useWalletForm from "../../hooks/useWalletForm";

// Simple responsive values based on screen width
const getResponsiveValues = (screenWidth) => {
  const isSmall = screenWidth < 350;
  return {
    itemSize: isSmall ? 44 : 48,
    padding: isSmall ? 12 : 16,
    spacing: isSmall ? 8 : 12,
  };
};

const WalletModal = ({ visible, onClose, wallet = null, onWalletUpdated }) => {
  const isEditing = !!wallet;
  const { createAccount, updateAccount } = useAccounts();
  const { accountSettingsQuery } = useSettings();

  const createWalletMutation = createAccount;
  const updateWalletMutation = updateAccount;

  // Get settings data - memoized for performance
  const accountSettings = accountSettingsQuery.data || {};
  const walletIcons = useMemo(
    () => accountSettings.icons || [],
    [accountSettings.icons]
  );
  const walletBackgrounds = useMemo(
    () => accountSettings.backgrounds || [],
    [accountSettings.backgrounds]
  );
  const walletTypes = useMemo(
    () => accountSettings.types || [],
    [accountSettings.types]
  );

  // Responsive dimensions - memoized for performance
  const responsive = useMemo(
    () => getResponsiveValues(Dimensions.get("window").width),
    []
  );

  // Form state management
  const { formData, errors, updateField, validateForm, resetForm } =
    useWalletForm(wallet, accountSettings, isEditing, visible);

  // Preview wallet data - memoized for performance
  const previewWallet = useMemo(
    () => ({
      name: formData.name || "Wallet Name",
      balance: formData.balance ? parseFloat(formData.balance) : 0,
      type: formData.type || "checking",
      icon: formData.icon,
      background: formData.background,
    }),
    [
      formData.name,
      formData.balance,
      formData.type,
      formData.icon,
      formData.background,
    ]
  );

  // Simple preview animation
  const previewAnim = useRef(new Animated.Value(1)).current;

  // Simple preview animation - memoized for performance
  const animatePreview = useCallback(() => {
    Animated.sequence([
      Animated.timing(previewAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(previewAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [previewAnim]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Prepare wallet data - unified for both create and update
      const walletData = {
        ...(isEditing && { id: wallet.id }), // Include only ID when editing
        name: formData.name.trim(),
        balance: formData.balance ? parseFloat(formData.balance) : 0,
        type: formData.type,
        icon: formData.icon,
        background: formData.background,
      };

      // Use the appropriate mutation
      const mutation = isEditing ? updateWalletMutation : createWalletMutation;
      await mutation.mutateAsync(walletData);

      // Success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Callback and cleanup
      if (onWalletUpdated) {
        onWalletUpdated();
      }

      if (!isEditing) {
        resetForm();
      }
      onClose();

      // Success message
      const action = isEditing ? "updated" : "created";
      Alert.alert("Success", `Wallet ${action} successfully`, [{ text: "OK" }]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const action = isEditing ? "update" : "create";
      Alert.alert("Error", error.message || `Failed to ${action} wallet`);
    }
  };

  const updateFormData = useCallback(
    (field, value) => {
      updateField(field, value);

      // Animate preview only for visual changes
      if (["icon", "background", "type"].includes(field)) {
        animatePreview();
      }
    },
    [updateField, animatePreview]
  );

  const handleIconSelect = useCallback(
    (iconName) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateFormData("icon", iconName);
    },
    [updateFormData]
  );

  const handleColorSelect = useCallback(
    (color) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateFormData("background", color);
    },
    [updateFormData]
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Simple inline values
  const title = isEditing ? "Edit Wallet" : "Add Wallet";
  const isSubmitting = isEditing
    ? updateWalletMutation.isPending
    : createWalletMutation.isPending;
  const submitText = isSubmitting
    ? isEditing
      ? "Updating..."
      : "Creating..."
    : isEditing
    ? "Update Wallet"
    : "Create Wallet";

  // Show loading state while settings are being fetched
  if (accountSettingsQuery.isLoading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}>
        <SafeAreaView style={styles.container}>
          <Header
            title={title}
            onBack={handleClose}
            style={{ paddingHorizontal: responsive.padding }}
          />
          <View
            style={[
              styles.content,
              {
                padding: responsive.padding,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}>
            <Text style={styles.sectionTitle}>Loading settings...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          title={title}
          onBack={handleClose}
          style={{ paddingHorizontal: responsive.padding }}
        />

        <ScrollView
          style={[styles.content, { padding: responsive.padding }]}
          showsVerticalScrollIndicator={false}>
          {/* Wallet Preview */}
          <WalletPreview
            wallet={previewWallet}
            animation={previewAnim}
            responsive={responsive}
          />

          {/* Form Fields */}
          <View
            style={[styles.formSection, { marginBottom: responsive.spacing }]}>
            {/* Icon Selector */}
            <IconSelector
              icons={walletIcons}
              selected={formData.icon}
              onSelect={handleIconSelect}
              responsive={responsive}
            />

            {/* Background Color Selector */}
            <ColorSelector
              colors={walletBackgrounds}
              selected={formData.background}
              onSelect={handleColorSelect}
              responsive={responsive}
            />

            {/* Type Selector */}
            <TypeSelector
              types={walletTypes}
              selected={formData.type}
              onSelect={(type) => updateFormData("type", type)}
              responsive={responsive}
            />

            {/* Input Fields */}
            <View style={styles.inputSection}>
              <Text style={styles.fieldLabel}>Wallet Details</Text>
              <TextInput
                placeholder="Enter wallet name"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                style={[styles.input, errors.name && styles.inputError]}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <AmountInput
                placeholder={
                  isEditing ? "Balance" : "Initial balance (optional)"
                }
                value={formData.balance}
                onChangeText={(value) => updateFormData("balance", value)}
                style={[styles.input, errors.balance && styles.inputError]}
                transactionType={"transfer"}
              />
              {errors.balance && (
                <Text style={styles.errorText}>{errors.balance}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { padding: responsive.padding }]}>
          <Button
            title={submitText}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },

  // Form sections
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },

  // Inputs
  inputSection: {
    marginTop: 12,
  },
  input: {
    marginBottom: 12,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },

  // Footer
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    marginTop: 0,
  },
});
