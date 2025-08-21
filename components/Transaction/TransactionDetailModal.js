import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TRANSACTION_TYPE,
  getTransactionTypeInfo,
} from "../../constants/Types/transactionTypes";

import { COLORS } from "../../constants/colors";
import Header from "../UI/Header";
import Icon from "../UI/Icon";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeleteTransaction } from "../../services/useDatabase";

const TransactionDetailModal = ({ visible, transaction, onClose, onEdit }) => {
  const deleteTransactionMutation = useDeleteTransaction();

  if (!transaction) return null;

  const {
    amount,
    title,
    description,
    categoryName,
    type,
    date,
    walletName,
    secondWalletName,
    categoryIcon,
    categoryBackground,
  } = transaction;

  const transactionInfo = getTransactionTypeInfo(type);
  const isTransfer = type === TRANSACTION_TYPE.TRANSFER;

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    const sign = isTransfer ? "" : transactionInfo.sign;
    return `${sign}$${absAmount.toFixed(2)}`;
  };

  const getTransactionIcon = () => {
    if (isTransfer) return "swap";
    if (categoryIcon) return categoryIcon;
    return transactionInfo.icon;
  };

  const getIconBackground = () => {
    if (isTransfer) return COLORS.transfer;
    if (categoryBackground) return categoryBackground;
    return transactionInfo.color;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const getAmountInsight = () => {
    const absAmount = Math.abs(amount);
    if (type === TRANSACTION_TYPE.EXPENSE) {
      if (absAmount > 100) return "Large expense";
      if (absAmount > 50) return "Medium expense";
      return "Small expense";
    } else if (type === TRANSACTION_TYPE.INCOME) {
      if (absAmount > 500) return "Great income!";
      if (absAmount > 100) return "Good income";
      return "Income received";
    }
    return "Transfer completed";
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
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
              onClose(); // Close modal after deletion
            } catch (error) {
              Alert.alert(
                "Error",
                error.message || "Failed to delete transaction"
              );
            }
          },
        },
      ]
    );
  };

  const renderDetailRow = (label, value, icon = null, iconColor = null) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelContainer}>
        {icon && (
          <Icon
            name={icon}
            size={16}
            color={iconColor || COLORS.textSecondary}
            style={styles.detailIcon}
          />
        )}
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          <SafeAreaView style={styles.container}>
            <Header
              title="Transaction Details"
              onBack={onClose}
              showBackButton={true}
              actions={[
                {
                  variant: "edit",
                  onPress: () => {
                    if (onEdit) {
                      onEdit(transaction);
                    }
                  },
                },
                {
                  variant: "delete",
                  onPress: handleDelete,
                },
              ]}
            />

            <View style={styles.content}>
              {/* Transaction Header */}
              <View style={styles.headerSection}>
                <View style={styles.iconContainer}>
                  <View
                    style={[
                      styles.iconBackground,
                      { backgroundColor: getIconBackground() },
                    ]}>
                    <Icon
                      name={getTransactionIcon()}
                      size={24}
                      color={COLORS.text}
                    />
                  </View>
                </View>

                <Text style={styles.transactionTitle}>{title}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transactionInfo.color },
                  ]}>
                  {formatCurrency(amount)}
                </Text>
                <Text style={styles.transactionType}>
                  {transactionInfo.label}
                </Text>
              </View>

              {/* Transaction Details */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Details</Text>

                <View style={styles.detailsContainer}>
                  {renderDetailRow("Date", formatDate(date), "calendar")}
                  {renderDetailRow("Time", formatTime(date), "clockcircle")}

                  {walletName &&
                    renderDetailRow("Wallet", walletName, "wallet")}

                  {isTransfer &&
                    secondWalletName &&
                    renderDetailRow(
                      "To Wallet",
                      secondWalletName,
                      "arrowright"
                    )}

                  {categoryName &&
                    !isTransfer &&
                    renderDetailRow("Category", categoryName, "tags")}

                  {description &&
                    renderDetailRow("Notes", description, "filetext1")}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "60%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textSecondary,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 8,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  transactionAmount: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -1,
  },
  transactionType: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 1,
  },

  detailsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  detailsContainer: {
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  additionalSection: {
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default TransactionDetailModal;
