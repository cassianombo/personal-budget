import { COLORS } from "../colors";

// Wallet type constants
export const WALLET_TYPE = {
  CREDIT: "credit",
  DEBIT: "debit",
  CASH: "cash",
};

// Array of all wallet types
export const WALLET_TYPES = [
  WALLET_TYPE.CREDIT,
  WALLET_TYPE.DEBIT,
  WALLET_TYPE.CASH,
];

// Wallet type metadata
export const WALLET_TYPE_METADATA = {
  [WALLET_TYPE.CREDIT]: {
    label: "Credit",
    color: COLORS.walletCredit,
    icon: "creditcard",
    description: "Credit card account",
  },
  [WALLET_TYPE.DEBIT]: {
    label: "Debit",
    color: COLORS.walletDebit,
    icon: "bank",
    description: "Debit card/bank account",
  },
  [WALLET_TYPE.CASH]: {
    label: "Cash",
    color: COLORS.walletCash,
    icon: "dollar",
    description: "Physical cash",
  },
};

// Helper functions
export const getWalletTypeInfo = (type) => {
  return WALLET_TYPE_METADATA[type] || WALLET_TYPE_METADATA.debit;
};

export const isValidWalletType = (type) => {
  return WALLET_TYPES.includes(type);
};
