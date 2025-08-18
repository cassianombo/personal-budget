// Simplified Dark Theme for Personal Finances App

// ===== ESSENTIAL COLORS =====
export const COLORS = {
  // Backgrounds
  background: "#0F0F23", // Main app background
  card: "#1A1A2E", // Card backgrounds
  input: "#0D1117", // Input field backgrounds

  // Text
  text: "#FFFFFF", // Primary text
  textSecondary: "#A0AEC0", // Secondary text
  textMuted: "#718096", // Muted text (placeholders, disabled)

  // Financial
  income: "#10B981", // Green for income/positive amounts
  expense: "#EF4444", // Red for expenses/negative amounts
  balance: "#3B82F6", // Blue for balance amounts

  // Status
  success: "#10B981", // Success states
  warning: "#F59E0B", // Warning states
  error: "#EF4444", // Error states

  // UI Elements
  primary: "#6366F1", // Primary buttons, links
  secondary: "#8B5CF6", // Secondary buttons
  border: "#2D3748", // Borders, dividers

  // Transaction Types
  transfer: "#3B82F6", // Blue for transfer transactions

  // Category Types
  categoryExpense: "#EF4444", // Red for expense categories
  categoryIncome: "#10B981", // Green for income categories

  // Wallet Types
  walletCredit: "#F59E0B", // Orange for credit cards
  walletDebit: "#10B981", // Green for debit cards
  walletCash: "#6B7280", // Gray for cash
};

// ===== COMMON USAGE =====
export const theme = {
  colors: COLORS,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

export default theme;
