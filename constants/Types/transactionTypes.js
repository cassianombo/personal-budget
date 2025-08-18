import { COLORS } from "../colors";

// Transaction type constants
export const TRANSACTION_TYPE = {
  EXPENSE: "expense",
  INCOME: "income",
  TRANSFER: "transfer",
};

// Array of all transaction types
export const TRANSACTION_TYPES = [
  TRANSACTION_TYPE.EXPENSE,
  TRANSACTION_TYPE.INCOME,
  TRANSACTION_TYPE.TRANSFER,
];

// Transaction type metadata
export const TRANSACTION_TYPE_METADATA = {
  [TRANSACTION_TYPE.EXPENSE]: {
    label: "Expense",
    color: COLORS.expense,
    icon: "minus-circle",
    sign: "-",
  },
  [TRANSACTION_TYPE.INCOME]: {
    label: "Income",
    color: COLORS.income,
    icon: "plus-circle",
    sign: "+",
  },
  [TRANSACTION_TYPE.TRANSFER]: {
    label: "Transfer",
    color: COLORS.transfer,
    icon: "swap",
    sign: "",
  },
};

// Helper functions
export const getTransactionTypeInfo = (type) => {
  return TRANSACTION_TYPE_METADATA[type] || TRANSACTION_TYPE_METADATA.expense;
};

export const isValidTransactionType = (type) => {
  return TRANSACTION_TYPES.includes(type);
};
