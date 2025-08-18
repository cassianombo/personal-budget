import categoriesMock from "./categoriesMock";

// Sample wallets data
export const walletsMock = [
  {
    id: "main-account",
    name: "Main Account",
    balance: 2500,
    icon: "wallet",
    background: "#4CAF50",
    type: "debit",
  },
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    balance: 5000,
    icon: "bank",
    background: "#2196F3",
    type: "debit",
  },
  {
    id: "credit-card",
    name: "Credit Card",
    balance: -1200,
    icon: "creditcard",
    background: "#FF5722",
    type: "credit",
  },
  {
    id: "cash-wallet",
    name: "Cash Wallet",
    balance: 350,
    icon: "pay-circle1",
    background: "#607D8B",
    type: "cash",
  },
];

// Sample transactions data
export const transactionsMock = [
  // Income transactions
  {
    id: "salary-1",
    amount: 3500,
    title: "Monthly Salary",
    categoryId: "salary",
    walletId: "main-account",
    date: "2024-01-15",
    description: "Monthly salary payment",
    type: "income",
  },
  {
    id: "freelance-1",
    amount: 500,
    title: "Freelance Project",
    categoryId: "freelance",
    walletId: "main-account",
    date: "2024-01-20",
    description: "Web development project",
    type: "income",
  },
  {
    id: "investment-1",
    amount: 200,
    title: "Dividend Payment",
    categoryId: "investments",
    walletId: "main-account",
    date: "2024-01-25",
    description: "Quarterly dividend",
    type: "income",
  },

  // Food & Dining transactions
  {
    id: "food-1",
    amount: -45.8,
    title: "Dinner at Italian Restaurant",
    categoryId: "food-dining",
    walletId: "main-account",
    date: "2024-01-18",
    description: "Dinner with friends",
    type: "expense",
  },
  {
    id: "food-2",
    amount: -12.5,
    title: "Coffee & Pastry",
    categoryId: "food-dining",
    walletId: "cash-wallet",
    date: "2024-01-19",
    description: "Morning coffee",
    type: "expense",
  },
  {
    id: "food-3",
    amount: -78.9,
    title: "Grocery Shopping",
    categoryId: "food-dining",
    walletId: "credit-card",
    date: "2024-01-20",
    description: "Weekly groceries",
    type: "expense",
  },

  // Transportation transactions
  {
    id: "transport-1",
    amount: -85.0,
    title: "Uber to Airport",
    categoryId: "transportation",
    walletId: "main-account",
    date: "2024-01-22",
    description: "Airport transfer",
    type: "expense",
  },
  {
    id: "transport-2",
    amount: -60.0,
    title: "Gas Station Fill-up",
    categoryId: "transportation",
    walletId: "credit-card",
    date: "2024-01-23",
    description: "Car fuel",
    type: "expense",
  },
  {
    id: "transport-3",
    amount: -15.75,
    title: "Public Transport Card",
    categoryId: "transportation",
    walletId: "cash-wallet",
    date: "2024-01-24",
    description: "Monthly pass",
    type: "expense",
  },

  // Shopping transactions
  {
    id: "shopping-1",
    amount: -120.0,
    title: "New Sneakers",
    categoryId: "shopping",
    walletId: "credit-card",
    date: "2024-01-21",
    description: "Running shoes",
    type: "expense",
  },
  {
    id: "shopping-2",
    amount: -89.99,
    title: "Books & Magazines",
    categoryId: "shopping",
    walletId: "main-account",
    date: "2024-01-25",
    description: "Educational books",
    type: "expense",
  },

  // Bills & Utilities transactions
  {
    id: "bills-1",
    amount: -85.5,
    title: "Electricity Bill",
    categoryId: "bills-utilities",
    walletId: "main-account",
    date: "2024-01-15",
    description: "Monthly electricity",
    type: "expense",
  },
  {
    id: "bills-2",
    amount: -120.0,
    title: "Internet & Cable",
    categoryId: "bills-utilities",
    walletId: "main-account",
    date: "2024-01-16",
    description: "Monthly internet",
    type: "expense",
  },

  // Healthcare transactions
  {
    id: "health-1",
    amount: -150.0,
    title: "Doctor Consultation",
    categoryId: "healthcare",
    walletId: "main-account",
    date: "2024-01-17",
    description: "Annual checkup",
    type: "expense",
  },
  {
    id: "health-2",
    amount: -35.0,
    title: "Pharmacy - Medications",
    categoryId: "healthcare",
    walletId: "cash-wallet",
    date: "2024-01-18",
    description: "Prescription meds",
    type: "expense",
  },

  // Entertainment transactions
  {
    id: "entertainment-1",
    amount: -65.0,
    title: "Concert Tickets",
    categoryId: "entertainment",
    walletId: "credit-card",
    date: "2024-01-26",
    description: "Rock concert",
    type: "expense",
  },
  {
    id: "entertainment-2",
    amount: -15.99,
    title: "Netflix Subscription",
    categoryId: "entertainment",
    walletId: "main-account",
    date: "2024-01-15",
    description: "Monthly subscription",
    type: "expense",
  },

  // Transfer transactions
  {
    id: "transfer-1",
    amount: -1000,
    title: "Transfer to Emergency Fund",
    categoryId: "investments",
    walletId: "main-account",
    secondWalletId: "emergency-fund",
    date: "2024-01-28",
    description: "Monthly savings transfer",
    type: "transfer",
  },
  {
    id: "transfer-2",
    amount: 1000,
    title: "Transfer from Main Account",
    categoryId: "investments",
    walletId: "emergency-fund",
    secondWalletId: "main-account",
    date: "2024-01-28",
    description: "Monthly savings transfer",
    type: "transfer",
  },
];

export default {
  categories: categoriesMock,
  wallets: walletsMock,
  transactions: transactionsMock,
};
