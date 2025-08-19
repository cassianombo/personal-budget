import { COLORS } from "./colors";

// Available wallet icons (exactly 6 options)
export const WALLET_ICONS = [
  { name: "bank", label: "Bank" },
  { name: "creditcard", label: "Credit Card" },
  { name: "wallet", label: "Wallet" },
  { name: "lock", label: "Lock" },
  { name: "gift", label: "Savings" },
  { name: "Trophy", label: "Goals" },
];

// Available background colors for wallets (exactly 6 options)
export const WALLET_BACKGROUND_COLORS = [
  COLORS.walletDebit, // Green
  COLORS.walletCredit, // Orange
  COLORS.walletCash, // Gray
  COLORS.primary, // Purple
  COLORS.secondary, // Violet
  COLORS.expense, // Red (for expenses)
];

// Default wallet configuration
export const DEFAULT_WALLET_CONFIG = {
  name: "",
  balance: "",
  type: "debit", // Using string instead of constant to avoid circular dependency
  icon: "bank",
  background: COLORS.walletDebit,
};
