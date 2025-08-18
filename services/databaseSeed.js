import databaseService from "./DatabaseService";
import { generateId } from "../utils/generateId";

// Sample data for seeding the database
const sampleCategories = [
  {
    id: generateId(),
    name: "Food & Dining",
    icon: "restaurant",
    background: "#FF6B6B",
    type: "expense",
  },
  {
    id: generateId(),
    name: "Transportation",
    icon: "car",
    background: "#4ECDC4",
    type: "expense",
  },
  {
    id: generateId(),
    name: "Shopping",
    icon: "shopping-cart",
    background: "#45B7D1",
    type: "expense",
  },
  {
    id: generateId(),
    name: "Salary",
    icon: "dollar-sign",
    background: "#96CEB4",
    type: "income",
  },
  {
    id: generateId(),
    name: "Investment",
    icon: "trending-up",
    background: "#FFEAA7",
    type: "income",
  },
];

const sampleWallets = [
  {
    id: generateId(),
    name: "Main Checking",
    balance: 2500.0,
    icon: "credit-card",
    background: "#6C5CE7",
    type: "debit",
  },
  {
    id: generateId(),
    name: "Savings Account",
    balance: 15000.0,
    icon: "piggy-bank",
    background: "#00B894",
    type: "debit",
  },
  {
    id: generateId(),
    name: "Credit Card",
    balance: -450.0,
    icon: "credit-card",
    background: "#E17055",
    type: "credit",
  },
  {
    id: generateId(),
    name: "Cash Wallet",
    balance: 120.0,
    icon: "dollar-sign",
    background: "#FDCB6E",
    type: "cash",
  },
];

// Function to seed the database with sample data
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Ensure database is initialized
    if (!databaseService.isInitialized) {
      await databaseService.init();
    }

    // Clear existing data (optional - remove this if you want to keep existing data)
    await databaseService.clearAllData();

    // Seed categories
    console.log("Seeding categories...");
    for (const category of sampleCategories) {
      await databaseService.createCategory(category);
    }

    // Seed wallets
    console.log("Seeding wallets...");
    for (const wallet of sampleWallets) {
      await databaseService.createWallet(wallet);
    }

    // Create some sample transactions
    console.log("Creating sample transactions...");
    const now = new Date();

    // Get the created wallets and categories for transactions
    const wallets = await databaseService.getWallets();
    const categories = await databaseService.getCategories();

    if (wallets.length > 0 && categories.length > 0) {
      const sampleTransactions = [
        {
          id: generateId(),
          amount: -25.5,
          categoryId: categories.find((c) => c.name === "Food & Dining")?.id,
          walletId: wallets.find((w) => w.name === "Main Checking")?.id,
          date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          title: "Lunch at Cafe",
          description: "Quick lunch with colleagues",
          type: "expense",
        },
        {
          id: generateId(),
          amount: -120.0,
          categoryId: categories.find((c) => c.name === "Shopping")?.id,
          walletId: wallets.find((w) => w.name === "Credit Card")?.id,
          date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          title: "Grocery Shopping",
          description: "Weekly groceries",
          type: "expense",
        },
        {
          id: generateId(),
          amount: 3500.0,
          categoryId: categories.find((c) => c.name === "Salary")?.id,
          walletId: wallets.find((w) => w.name === "Main Checking")?.id,
          date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          title: "Monthly Salary",
          description: "Salary deposit",
          type: "income",
        },
        {
          id: generateId(),
          amount: 500.0,
          categoryId: null, // Transfer doesn't need category
          walletId: wallets.find((w) => w.name === "Main Checking")?.id,
          secondWalletId: wallets.find((w) => w.name === "Savings Account")?.id,
          date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          title: "Monthly Savings",
          description: "Transfer to savings",
          type: "transfer",
        },
      ];

      for (const transaction of sampleTransactions) {
        await databaseService.createTransaction(transaction);
      }
    }

    console.log("Database seeding completed successfully!");

    // Return summary
    const summary = await databaseService.getDatabaseStatus();
    console.log("Database summary:", summary);

    return {
      success: true,
      message: "Database seeded successfully",
      summary,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Failed to seed database",
      error: error.message,
    };
  }
};

// Function to clear all data from database
export const clearDatabase = async () => {
  try {
    console.log("Clearing database...");

    if (!databaseService.isInitialized) {
      await databaseService.init();
    }

    await databaseService.clearAllData();

    console.log("Database cleared successfully!");
    return {
      success: true,
      message: "Database cleared successfully",
    };
  } catch (error) {
    console.error("Error clearing database:", error);
    return {
      success: false,
      message: "Failed to clear database",
      error: error.message,
    };
  }
};

// Helper function to get database statistics
export const getDatabaseStats = async () => {
  try {
    if (!databaseService.isInitialized) {
      await databaseService.init();
    }

    const stats = await databaseService.getDatabaseStatus();
    const totalBalance = await databaseService.getTotalBalance();

    return {
      ...stats,
      totalBalance,
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return null;
  }
};
