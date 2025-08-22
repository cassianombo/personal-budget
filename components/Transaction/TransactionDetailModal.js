import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import {
  TRANSACTION_TYPE,
  getTransactionTypeInfo,
} from "../../constants/Types/transactionTypes";

import { COLORS } from "../../constants/colors";
import Header from "../UI/Header";
import Icon from "../UI/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeleteTransaction } from "../../services/useDatabase";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Constants for better maintainability and performance
const DATE_FORMAT_OPTIONS = {
  full: {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  time: {
    hour: "2-digit",
    minute: "2-digit",
  },
};

// Responsive sizing based on screen dimensions
const getResponsiveSize = (baseSize, scale = 1) => {
  const scaleFactor = Math.min(screenWidth / 375, screenHeight / 812); // Base on iPhone X dimensions

  // Special handling for iPhone 16 Plus and similar medium screens
  if (screenHeight >= 800 && screenHeight < 900) {
    // Medium screens (iPhone 16 Plus) - slightly larger than base
    return baseSize * 1.05;
  }

  // For smaller screens, make elements smaller; for larger screens, make them slightly smaller too
  const adjustedSize = baseSize * scaleFactor * scale;
  // Ensure minimum and maximum bounds for readability
  // Cap at 110% for larger screens to keep text readable
  return Math.max(Math.min(adjustedSize, baseSize * 1.1), baseSize * 0.7);
};

// Responsive modal height based on screen size
const getModalHeight = () => {
  if (screenHeight < 700) return "85%"; // Small screens - more space needed
  if (screenHeight < 800) return "70%"; // Medium screens
  return "60%"; // Large screens
};

// Optimize the entire component with React.memo to prevent unnecessary re-renders
const TransactionDetailModal = React.memo(
  ({ visible, transaction, onClose, onEdit }) => {
    const deleteTransactionMutation = useDeleteTransaction();

    // Memoize expensive calculations with better dependency tracking
    const transactionInfo = useMemo(
      () => (transaction ? getTransactionTypeInfo(transaction.type) : null),
      [transaction?.type]
    );

    const isTransfer = useMemo(
      () => transaction?.type === TRANSACTION_TYPE.TRANSFER,
      [transaction?.type]
    );

    // Optimize currency formatting with better memoization
    const formattedCurrency = useMemo(() => {
      if (!transaction?.amount) return "";
      const absAmount = Math.abs(transaction.amount);
      const sign = isTransfer ? "" : transactionInfo?.sign || "";
      return `${sign}$${absAmount.toFixed(2)}`;
    }, [transaction?.amount, isTransfer, transactionInfo?.sign]);

    // Optimize icon selection logic
    const transactionIcon = useMemo(() => {
      if (!transaction) return "";
      if (isTransfer) return "swap";
      return transaction.categoryIcon || transactionInfo?.icon || "";
    }, [isTransfer, transaction?.categoryIcon, transactionInfo?.icon]);

    // Optimize background color selection
    const iconBackground = useMemo(() => {
      if (!transaction) return COLORS.textSecondary;
      if (isTransfer) return COLORS.transfer;
      return (
        transaction.categoryBackground ||
        transactionInfo?.color ||
        COLORS.textSecondary
      );
    }, [isTransfer, transaction?.categoryBackground, transactionInfo?.color]);

    // Optimize date formatting with shared date object
    const dateInfo = useMemo(() => {
      if (!transaction?.date) return null;
      const dateObj = new Date(transaction.date);
      return {
        dateObj,
        formattedDate: dateObj.toLocaleDateString(
          "en-US",
          DATE_FORMAT_OPTIONS.full
        ),
        formattedTime: dateObj.toLocaleTimeString(
          "en-US",
          DATE_FORMAT_OPTIONS.time
        ),
      };
    }, [transaction?.date]);

    // Optimize callback functions with better dependency arrays
    const handleDelete = useCallback(() => {
      if (!transaction) return;

      Alert.alert(
        "Delete Transaction",
        `Are you sure you want to delete "${transaction.title}" for ${formattedCurrency}? This action cannot be undone.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteTransactionMutation.mutateAsync(transaction.id);
                onClose();
              } catch (error) {
                Alert.alert(
                  "Error",
                  error.message ||
                    "Failed to delete transaction. Please try again."
                );
              }
            },
          },
        ]
      );
    }, [transaction, formattedCurrency, onClose, deleteTransactionMutation]);

    const handleEdit = useCallback(() => {
      if (onEdit && transaction) {
        onEdit(transaction);
      }
    }, [onEdit, transaction]);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    const handleModalPress = useCallback((e) => {
      e.stopPropagation();
    }, []);

    // Optimize detail row renderer with stable reference
    const renderDetailRow = useCallback(
      (label, value, icon = null, iconColor = null) => (
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            {icon && (
              <Icon
                name={icon}
                size={getResponsiveSize(16)}
                color={iconColor || COLORS.textSecondary}
                style={styles.detailIcon}
                accessibilityLabel={`${label} icon`}
              />
            )}
            <Text style={styles.detailLabel}>{label}</Text>
          </View>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      ),
      []
    );

    // Loading state for delete operation
    const isDeleting = deleteTransactionMutation.isPending;

    // Early return with null check - AFTER all hooks
    if (!transaction) return null;

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
        accessibilityLabel="Transaction details modal"
        accessibilityHint="Shows detailed information about the selected transaction">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close modal">
          <TouchableOpacity
            style={[styles.modalContent, { height: getModalHeight() }]}
            activeOpacity={1}
            onPress={handleModalPress}
            accessibilityRole="none">
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            <SafeAreaView style={styles.container}>
              <Header
                title="Transaction Details"
                onBack={handleClose}
                showBackButton={true}
                actions={[
                  {
                    variant: "edit",
                    onPress: handleEdit,
                    disabled: isDeleting,
                  },
                  {
                    variant: "delete",
                    onPress: handleDelete,
                    disabled: isDeleting,
                  },
                ]}
              />

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                accessibilityLabel="Transaction details content">
                {/* Transaction Header */}
                <View style={styles.headerSection}>
                  <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                      <View
                        style={[
                          styles.iconBackground,
                          { backgroundColor: iconBackground },
                        ]}
                        accessibilityLabel={`Transaction type: ${transactionInfo?.label}`}>
                        <Icon
                          name={transactionIcon}
                          size={getResponsiveSize(28)}
                          color={COLORS.text}
                          accessibilityLabel={transactionInfo?.label}
                        />
                      </View>
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.transactionTitle}>
                        {transaction?.title}
                      </Text>
                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: transactionInfo?.color },
                        ]}
                        accessibilityLabel={`Amount: ${formattedCurrency}`}>
                        {formattedCurrency}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Transaction Details */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Details</Text>

                  <View style={styles.detailsContainer}>
                    {renderDetailRow(
                      "Date",
                      dateInfo?.formattedDate,
                      "calendar"
                    )}
                    {renderDetailRow(
                      "Time",
                      dateInfo?.formattedTime,
                      "clockcircle"
                    )}

                    {transaction?.walletName &&
                      renderDetailRow(
                        "Wallet",
                        transaction.walletName,
                        "wallet"
                      )}

                    {isTransfer &&
                      transaction?.secondWalletName &&
                      renderDetailRow(
                        "To Wallet",
                        transaction.secondWalletName,
                        "arrowright"
                      )}

                    {transaction?.categoryName &&
                      !isTransfer &&
                      renderDetailRow(
                        "Category",
                        transaction.categoryName,
                        "tags"
                      )}

                    {transaction?.description &&
                      renderDetailRow(
                        "Notes",
                        transaction.description,
                        "filetext1"
                      )}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }
);

TransactionDetailModal.displayName = "TransactionDetailModal";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: getResponsiveSize(20),
    borderTopRightRadius: getResponsiveSize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: getResponsiveSize(16),
    elevation: 16,
  },
  dragHandle: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(4),
    backgroundColor: COLORS.textSecondary,
    borderRadius: getResponsiveSize(2),
    alignSelf: "center",
    marginTop: getResponsiveSize(8),
    marginBottom: getResponsiveSize(6),
    opacity: 0.6,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(16),
    paddingTop: getResponsiveSize(6),
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: getResponsiveSize(20),
    marginBottom: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(16),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    maxWidth: getResponsiveSize(280),
  },
  iconContainer: {
    marginRight: getResponsiveSize(16),
  },
  iconBackground: {
    width: getResponsiveSize(52),
    height: getResponsiveSize(52),
    borderRadius: getResponsiveSize(26),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  transactionTitle: {
    fontSize: getResponsiveSize(16),
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "left",
    marginBottom: getResponsiveSize(4),
    letterSpacing: -0.5,
    lineHeight: getResponsiveSize(20),
  },
  transactionAmount: {
    fontSize: getResponsiveSize(20),
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: getResponsiveSize(24),
  },
  detailsSection: {
    marginBottom: getResponsiveSize(12),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(13),
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: getResponsiveSize(12),
    letterSpacing: -0.2,
    paddingHorizontal: getResponsiveSize(4),
  },
  detailsContainer: {
    paddingVertical: getResponsiveSize(2),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    marginRight: getResponsiveSize(12),
  },
  detailLabel: {
    fontSize: getResponsiveSize(13),
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  detailValue: {
    fontSize: getResponsiveSize(13),
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    letterSpacing: -0.1,
  },
});

export default TransactionDetailModal;
