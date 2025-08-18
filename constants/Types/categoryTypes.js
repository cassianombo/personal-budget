import { COLORS } from "../colors";

// Category type constants
export const CATEGORY_TYPE = {
  EXPENSE: "expense",
  INCOME: "income",
};

// Array of all category types
export const CATEGORY_TYPES = [CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.INCOME];

// Category type metadata
export const CATEGORY_TYPE_METADATA = {
  [CATEGORY_TYPE.EXPENSE]: {
    label: "Expense",
    color: COLORS.categoryExpense,
    icon: "minus-circle",
  },
  [CATEGORY_TYPE.INCOME]: {
    label: "Income",
    color: COLORS.categoryIncome,
    icon: "plus-circle",
  },
};

// Helper functions
export const getCategoryTypeInfo = (type) => {
  return CATEGORY_TYPE_METADATA[type] || CATEGORY_TYPE_METADATA.expense;
};

export const isValidCategoryType = (type) => {
  return CATEGORY_TYPES.includes(type);
};
