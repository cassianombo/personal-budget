import * as Haptics from "expo-haptics";

import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AmountInput, Button, Header, IconButton, TextInput } from "../UI";
import {
  DEFAULT_WALLET_CONFIG,
  WALLET_BACKGROUND_COLORS,
  WALLET_ICONS,
} from "../../constants/walletOptions";
import React, { useEffect, useRef, useState } from "react";
import { useCreateWallet, useUpdateWallet } from "../../services/useDatabase";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { WALLET_TYPE_METADATA } from "../../constants/Types/walletTypes";
import WalletItem from "./WalletItem";
import { formatCurrency } from "../../utils/helpers";
import { generateId } from "../../utils/generateId";

// Constants
const ITEMS_PER_ROW = 6;

// Helper function to calculate responsive dimensions
const calculateResponsiveDimensions = (screenWidth) => {
  const isSmallScreen = screenWidth < 350;

  const gridPadding = isSmallScreen ? 12 : 16;
  const itemSpacing = isSmallScreen ? 16 : 20;

  // Calculate item size to fit exactly 6 items in one row
  const totalSpacing = itemSpacing * (ITEMS_PER_ROW - 1);
  const totalPadding = gridPadding * 2;
  const availableWidth = screenWidth - totalPadding - totalSpacing;
  const calculatedItemSize = Math.floor(availableWidth / ITEMS_PER_ROW);

  // Ensure minimum and maximum sizes
  const minItemSize = isSmallScreen ? 40 : 44;
  const maxItemSize = isSmallScreen ? 56 : 60;
  const itemSize = Math.max(
    minItemSize,
    Math.min(maxItemSize, calculatedItemSize)
  );

  return {
    gridPadding,
    itemSpacing,
    itemSize,
    sectionSpacing: isSmallScreen ? 12 : 10,
    contentPadding: isSmallScreen ? 16 : 12,
    headerPadding: isSmallScreen ? 16 : 14,
    isSmallScreen,
  };
};

const WalletModal = ({ visible, onClose, wallet = null }) => {
  const isEditing = !!wallet;
  const createWalletMutation = useCreateWallet();
  const updateWalletMutation = useUpdateWallet();

  // Responsive dimensions state
  const [screenDimensions, setScreenDimensions] = useState(() =>
    Dimensions.get("window")
  );

  // Update dimensions on orientation change
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Calculate responsive values
  const responsiveValues = calculateResponsiveDimensions(
    screenDimensions.width
  );

  // State
  const [formData, setFormData] = useState(DEFAULT_WALLET_CONFIG);
  const [errors, setErrors] = useState({});

  // Animation refs
  const previewScaleAnim = useRef(new Animated.Value(1)).current;
  const previewOpacityAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnims = useRef(
    WALLET_ICONS.reduce((acc, icon) => {
      acc[icon.name] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;
  const colorScaleAnims = useRef(
    WALLET_BACKGROUND_COLORS.reduce((acc, color) => {
      acc[color] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  // Effects
  useEffect(() => {
    if (visible) {
      if (isEditing && wallet) {
        // Initialize form with wallet data for editing
        setFormData({
          name: wallet.name || "",
          balance: wallet.balance ? wallet.balance.toString() : "0",
          type: wallet.type || "checking",
          icon: wallet.icon || "wallet",
          background: wallet.background || "#4A90E2",
        });
      } else {
        // Reset form for adding new wallet
        setFormData(DEFAULT_WALLET_CONFIG);
      }
      setErrors({});
    }
  }, [visible, wallet, isEditing]);

  // Animation functions
  const animatePreviewChange = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(previewScaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(previewScaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const animateSelection = (animationRef) => {
    Animated.sequence([
      Animated.timing(animationRef, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(animationRef, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetForm = () => {
    setFormData(DEFAULT_WALLET_CONFIG);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Wallet name is required";
    }

    if (formData.balance && isNaN(parseFloat(formData.balance))) {
      newErrors.balance = "Balance must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        // Update existing wallet
        const walletData = {
          ...wallet,
          name: formData.name.trim(),
          balance: formData.balance ? parseFloat(formData.balance) : 0,
          type: formData.type,
          icon: formData.icon,
          background: formData.background,
        };

        await updateWalletMutation.mutateAsync(walletData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Wallet updated successfully", [
          { text: "OK", onPress: onClose },
        ]);
      } else {
        // Create new wallet
        const walletData = {
          id: generateId(),
          name: formData.name.trim(),
          balance: formData.balance ? parseFloat(formData.balance) : 0,
          type: formData.type,
          icon: formData.icon,
          background: formData.background,
        };

        await createWalletMutation.mutateAsync(walletData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Wallet created successfully", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Error",
        error.message || `Failed to ${isEditing ? "update" : "create"} wallet`
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Animate preview change for visual fields
    if (["icon", "background", "type", "name"].includes(field)) {
      animatePreviewChange();
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleIconSelect = (iconName) => {
    animateSelection(iconScaleAnims[iconName]);
    updateFormData("icon", iconName);
  };

  const handleColorSelect = (color) => {
    animateSelection(colorScaleAnims[color]);
    updateFormData("background", color);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getTitle = () => (isEditing ? "Edit Wallet" : "Add Wallet");
  const getSubmitText = () => {
    if (isEditing) {
      return updateWalletMutation.isPending ? "Updating..." : "Update Wallet";
    }
    return createWalletMutation.isPending ? "Creating..." : "Create Wallet";
  };
  const isSubmitting = isEditing
    ? updateWalletMutation.isPending
    : createWalletMutation.isPending;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          title={getTitle()}
          onBack={handleClose}
          style={{ paddingHorizontal: responsiveValues.headerPadding }}
        />

        <ScrollView
          style={[styles.content, { padding: responsiveValues.contentPadding }]}
          showsVerticalScrollIndicator={false}>
          {/* Wallet Preview */}
          <View
            style={[
              styles.previewSection,
              { marginBottom: responsiveValues.sectionSpacing },
            ]}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewContainer}>
              <Animated.View
                style={{
                  transform: [{ scale: previewScaleAnim }],
                  opacity: previewOpacityAnim,
                }}>
                <WalletItem
                  wallet={{
                    name: formData.name || "Wallet Name",
                    balance: formData.balance
                      ? parseFloat(formData.balance)
                      : 0,
                    type: formData.type || "checking",
                    icon: formData.icon,
                    background: formData.background,
                  }}
                />
              </Animated.View>
            </View>
          </View>

          {/* Form Fields */}
          <View
            style={[
              styles.formSection,
              { marginBottom: responsiveValues.sectionSpacing },
            ]}>
            {/* Icon Selector */}
            <View
              style={[
                styles.iconSection,
                { marginBottom: responsiveValues.sectionSpacing },
              ]}>
              <Text style={styles.fieldLabel}>Choose Icon</Text>
              <View
                style={[
                  styles.iconGrid,
                  { paddingHorizontal: responsiveValues.gridPadding },
                ]}>
                {WALLET_ICONS.map((icon) => (
                  <Animated.View
                    key={icon.name}
                    style={{
                      transform: [{ scale: iconScaleAnims[icon.name] }],
                    }}>
                    <IconButton
                      icon={icon.name}
                      onPress={() => handleIconSelect(icon.name)}
                      style={[
                        styles.iconOption,
                        {
                          width: responsiveValues.itemSize,
                          height: responsiveValues.itemSize,
                          borderRadius: responsiveValues.itemSize / 4,
                        },
                        formData.icon === icon.name &&
                          styles.iconOptionSelected,
                      ]}
                      iconColor={
                        formData.icon === icon.name
                          ? COLORS.text
                          : COLORS.textSecondary
                      }
                    />
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Background Color Selector */}
            <View
              style={[
                styles.colorSection,
                { marginBottom: responsiveValues.sectionSpacing },
              ]}>
              <Text style={styles.fieldLabel}>Choose Color</Text>
              <View
                style={[
                  styles.colorGrid,
                  { paddingHorizontal: responsiveValues.gridPadding },
                ]}>
                {WALLET_BACKGROUND_COLORS.map((color) => (
                  <Animated.View
                    key={color}
                    style={{
                      transform: [{ scale: colorScaleAnims[color] }],
                    }}>
                    <Pressable
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: color,
                          width: responsiveValues.itemSize,
                          height: responsiveValues.itemSize,
                          borderRadius: responsiveValues.itemSize / 4,
                        },
                        formData.background === color &&
                          styles.colorOptionSelected,
                      ]}
                      onPress={() => handleColorSelect(color)}>
                      {formData.background === color && (
                        <Animated.View
                          style={{
                            transform: [{ scale: 1.2 }],
                          }}>
                          <Icon
                            name="check"
                            size={responsiveValues.isSmallScreen ? 14 : 16}
                            color={COLORS.text}
                          />
                        </Animated.View>
                      )}
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Type Selector */}
            <View
              style={[
                styles.typeSection,
                { marginBottom: responsiveValues.sectionSpacing },
              ]}>
              <Text style={styles.fieldLabel}>Wallet Type</Text>
              <View style={styles.typeContainer}>
                {Object.entries(WALLET_TYPE_METADATA).map(([type, info]) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.typeOption,
                      formData.type === type && styles.typeOptionSelected,
                    ]}
                    onPress={() => updateFormData("type", type)}>
                    <Icon
                      name={info.icon}
                      size={20}
                      color={
                        formData.type === type
                          ? COLORS.text
                          : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        formData.type === type && styles.typeLabelSelected,
                      ]}>
                      {info.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
        <View
          style={[styles.footer, { padding: responsiveValues.contentPadding }]}>
          <Button
            title={getSubmitText()}
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

  // Preview
  previewSection: {
    marginBottom: 20,
  },
  previewContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Form sections
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },

  // Icon and color grids
  iconSection: {
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  iconOption: {
    backgroundColor: COLORS.input,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  colorSection: {
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  colorOption: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: COLORS.text,
    borderWidth: 3,
  },

  // Type selector
  typeSection: {
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.input,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  typeLabelSelected: {
    color: COLORS.text,
    fontWeight: "600",
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
