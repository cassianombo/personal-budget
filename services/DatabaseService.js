import * as SQLite from "expo-sqlite";

import { CATEGORY_TYPES, TRANSACTION_TYPES, WALLET_TYPES } from "../constants";

// Custom error class for database operations
class DatabaseError extends Error {
  constructor(message, operation, originalError = null) {
    super(message);
    this.name = "DatabaseError";
    this.operation = operation;
    this.originalError = originalError;
  }
}

// Migration schema definitions
const MIGRATIONS = [
  {
    version: 1,
    name: "Initial schema",
    up: `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        background TEXT,
        type TEXT NOT NULL DEFAULT 'expense'
      );
      
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        balance REAL DEFAULT 0,
        icon TEXT,
        background TEXT,
        type TEXT DEFAULT 'debit'
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        categoryId TEXT,
        walletId TEXT NOT NULL,
        secondWalletId TEXT,
        date TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT 'Transaction',
        description TEXT DEFAULT '',
        type TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE SET NULL,
        FOREIGN KEY (walletId) REFERENCES wallets (id) ON DELETE CASCADE,
        FOREIGN KEY (secondWalletId) REFERENCES wallets (id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(walletId);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(categoryId);
    `,
  },
];

// Input validation schemas
const VALIDATION_SCHEMAS = {
  category: {
    id: { type: "string", required: true },
    name: { type: "string", required: true, minLength: 1, maxLength: 100 },
    icon: { type: "string", required: false },
    background: { type: "string", required: false },
    type: { type: "string", required: true, enum: CATEGORY_TYPES },
  },
  wallet: {
    id: { type: "string", required: true },
    name: { type: "string", required: true, minLength: 1, maxLength: 100 },
    balance: { type: "number", required: false, default: 0 },
    icon: { type: "string", required: false },
    background: { type: "string", required: false },
    type: {
      type: "string",
      required: false,
      enum: WALLET_TYPES,
      default: "debit",
    },
  },
  transaction: {
    id: { type: "string", required: true },
    amount: { type: "number", required: true },
    categoryId: { type: "string", required: false },
    walletId: { type: "string", required: true },
    secondWalletId: { type: "string", required: false },
    date: { type: "string", required: true },
    title: { type: "string", required: true, minLength: 1, maxLength: 200 },
    description: {
      type: "string",
      required: false,
      maxLength: 500,
      default: "",
    },
    type: {
      type: "string",
      required: true,
      enum: TRANSACTION_TYPES,
    },
  },
};

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.currentVersion = 0;
  }

  // Initialize database and run migrations
  async init() {
    if (this.isInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync("personal_finances2.db");
      await this.createMigrationTable();
      await this.runMigrations();
      this.isInitialized = true;
    } catch (error) {
      throw new DatabaseError("Failed to initialize database", "init", error);
    }
  }

  // Create migration tracking table
  async createMigrationTable() {
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // Run pending migrations
  async runMigrations() {
    try {
      // Get current version
      const result = await this.db.getFirstAsync(
        "SELECT MAX(version) as current_version FROM migrations"
      );
      this.currentVersion = result?.current_version || 0;

      // Run pending migrations
      for (const migration of MIGRATIONS) {
        if (migration.version > this.currentVersion) {
          await this.db.execAsync(migration.up);
          await this.db.runAsync(
            "INSERT INTO migrations (version, name) VALUES (?, ?)",
            [migration.version, migration.name]
          );
          this.currentVersion = migration.version;
        }
      }
    } catch (error) {
      throw new DatabaseError(
        "Failed to run migrations",
        "runMigrations",
        error
      );
    }
  }

  // Input validation helper
  validateInput(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required fields
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip validation for undefined optional fields
      if (value === undefined || value === null) continue;

      // Type validation
      if (rules.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      } else if (rules.type === "number" && typeof value !== "number") {
        errors.push(`${field} must be a number`);
      }

      // String length validation
      if (rules.type === "string" && typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(
            `${field} must be at least ${rules.minLength} characters`
          );
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
      }
    }

    if (errors.length > 0) {
      throw new DatabaseError(
        `Validation failed: ${errors.join(", ")}`,
        "validateInput"
      );
    }

    // Apply defaults
    const validatedData = { ...data };
    for (const [field, rules] of Object.entries(schema)) {
      if (validatedData[field] === undefined && rules.default !== undefined) {
        validatedData[field] = rules.default;
      }
    }

    return validatedData;
  }

  // Transaction wrapper for operations that modify multiple tables
  async withTransaction(operation) {
    try {
      await this.db.execAsync("BEGIN TRANSACTION");
      const result = await operation();
      await this.db.execAsync("COMMIT");
      return result;
    } catch (error) {
      await this.db.execAsync("ROLLBACK");
      throw error;
    }
  }

  // Category operations
  async createCategory(categoryData) {
    try {
      const validatedCategory = this.validateInput(
        categoryData,
        VALIDATION_SCHEMAS.category
      );

      await this.db.runAsync(
        "INSERT INTO categories (id, name, icon, background, type) VALUES (?, ?, ?, ?, ?)",
        [
          validatedCategory.id,
          validatedCategory.name,
          validatedCategory.icon,
          validatedCategory.background,
          validatedCategory.type,
        ]
      );

      return validatedCategory;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to create category",
        "createCategory",
        error
      );
    }
  }

  async getCategories() {
    try {
      // Ensure database is initialized
      if (!this.isInitialized || !this.db) {
        console.warn("Database not initialized, returning empty array");
        return [];
      }

      const result = await this.db.getAllAsync(
        "SELECT * FROM categories ORDER BY name"
      );

      // Ensure we have valid data
      if (!Array.isArray(result)) {
        console.warn("Invalid result from database, returning empty array");
        return [];
      }

      return result.map((row) => ({
        id: row.id,
        name: row.name,
        icon: row.icon,
        background: row.background,
        type: row.type,
      }));
    } catch (error) {
      console.error("Error getting categories:", error);
      // Return empty array instead of throwing error to prevent app crash
      return [];
    }
  }

  async updateCategory(categoryData) {
    try {
      const validatedCategory = this.validateInput(
        categoryData,
        VALIDATION_SCHEMAS.category
      );

      const result = await this.db.runAsync(
        "UPDATE categories SET name = ?, icon = ?, background = ?, type = ? WHERE id = ?",
        [
          validatedCategory.name,
          validatedCategory.icon,
          validatedCategory.background,
          validatedCategory.type,
          validatedCategory.id,
        ]
      );

      if (result.changes === 0) {
        throw new DatabaseError("Category not found", "updateCategory");
      }

      return validatedCategory;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to update category",
        "updateCategory",
        error
      );
    }
  }

  async deleteCategory(id) {
    try {
      if (!id || typeof id !== "string") {
        throw new DatabaseError("Invalid category ID", "deleteCategory");
      }

      const result = await this.db.runAsync(
        "DELETE FROM categories WHERE id = ?",
        [id]
      );

      if (result.changes === 0) {
        throw new DatabaseError("Category not found", "deleteCategory");
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to delete category",
        "deleteCategory",
        error
      );
    }
  }

  // Wallet operations
  async createWallet(walletData) {
    try {
      const validatedWallet = this.validateInput(
        walletData,
        VALIDATION_SCHEMAS.wallet
      );

      await this.db.runAsync(
        "INSERT INTO wallets (id, name, balance, icon, background, type) VALUES (?, ?, ?, ?, ?, ?)",
        [
          validatedWallet.id,
          validatedWallet.name,
          validatedWallet.balance,
          validatedWallet.icon,
          validatedWallet.background,
          validatedWallet.type,
        ]
      );

      return validatedWallet;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to create wallet", "createWallet", error);
    }
  }

  async getWallets() {
    try {
      // Ensure database is initialized
      if (!this.isInitialized || !this.db) {
        console.warn("Database not initialized, returning empty array");
        return [];
      }

      const result = await this.db.getAllAsync(
        "SELECT * FROM wallets ORDER BY name"
      );

      // Ensure we have valid data
      if (!Array.isArray(result)) {
        console.warn("Invalid result from database, returning empty array");
        return [];
      }

      return result.map((row) => ({
        id: row.id,
        name: row.name,
        balance: row.balance,
        icon: row.icon,
        background: row.background,
        type: row.type,
      }));
    } catch (error) {
      console.error("Error getting wallets:", error);
      // Return empty array instead of throwing error to prevent app crash
      return [];
    }
  }

  async updateWallet(walletData) {
    try {
      const validatedWallet = this.validateInput(
        walletData,
        VALIDATION_SCHEMAS.wallet
      );

      const result = await this.db.runAsync(
        "UPDATE wallets SET name = ?, balance = ?, icon = ?, background = ?, type = ? WHERE id = ?",
        [
          validatedWallet.name,
          validatedWallet.balance,
          validatedWallet.icon,
          validatedWallet.background,
          validatedWallet.type,
          validatedWallet.id,
        ]
      );

      if (result.changes === 0) {
        throw new DatabaseError("Wallet not found", "updateWallet");
      }

      return validatedWallet;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update wallet", "updateWallet", error);
    }
  }

  async deleteWallet(id) {
    try {
      if (!id || typeof id !== "string") {
        throw new DatabaseError("Invalid wallet ID", "deleteWallet");
      }

      // Check if wallet has transactions
      const transactionCount = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM transactions WHERE walletId = ? OR secondWalletId = ?",
        [id, id]
      );

      if (transactionCount.count > 0) {
        throw new DatabaseError(
          "Cannot delete wallet with existing transactions",
          "deleteWallet"
        );
      }

      const result = await this.db.runAsync(
        "DELETE FROM wallets WHERE id = ?",
        [id]
      );

      if (result.changes === 0) {
        throw new DatabaseError("Wallet not found", "deleteWallet");
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to delete wallet", "deleteWallet", error);
    }
  }

  // Transaction operations
  async createTransaction(transactionData) {
    try {
      const validatedTransaction = this.validateInput(
        transactionData,
        VALIDATION_SCHEMAS.transaction
      );

      return await this.withTransaction(async () => {
        // Insert transaction
        await this.db.runAsync(
          "INSERT INTO transactions (id, amount, categoryId, walletId, secondWalletId, date, title, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            validatedTransaction.id,
            validatedTransaction.amount,
            validatedTransaction.categoryId,
            validatedTransaction.walletId,
            validatedTransaction.secondWalletId,
            validatedTransaction.date,
            validatedTransaction.title,
            validatedTransaction.description,
            validatedTransaction.type,
          ]
        );

        // Update wallet balance based on transaction type
        if (validatedTransaction.type === "transfer") {
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            -Math.abs(validatedTransaction.amount)
          );
          if (validatedTransaction.secondWalletId) {
            await this.updateWalletBalance(
              validatedTransaction.secondWalletId,
              Math.abs(validatedTransaction.amount)
            );
          }
        } else if (validatedTransaction.type === "expense") {
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            -Math.abs(validatedTransaction.amount)
          );
        } else if (validatedTransaction.type === "income") {
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            Math.abs(validatedTransaction.amount)
          );
        }

        return validatedTransaction;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to create transaction",
        "createTransaction",
        error
      );
    }
  }

  async getTransactions(filters = {}) {
    try {
      let query = `
        SELECT t.*, c.name as categoryName, c.icon as categoryIcon, c.background as categoryBackground, w.name as walletName, w2.name as secondWalletName 
        FROM transactions t
        LEFT JOIN categories c ON t.categoryId = c.id
        LEFT JOIN wallets w ON t.walletId = w.id
        LEFT JOIN wallets w2 ON t.secondWalletId = w2.id
      `;

      const params = [];
      const conditions = [];

      // Apply filters
      if (filters.walletId) {
        conditions.push("(t.walletId = ? OR t.secondWalletId = ?)");
        params.push(filters.walletId, filters.walletId);
      }

      if (filters.categoryId) {
        conditions.push("t.categoryId = ?");
        params.push(filters.categoryId);
      }

      if (filters.startDate) {
        conditions.push("t.date >= ?");
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        conditions.push("t.date <= ?");
        params.push(filters.endDate);
      }

      if (filters.type) {
        conditions.push("t.type = ?");
        params.push(filters.type);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY t.date DESC";

      const result = await this.db.getAllAsync(query, params);
      return result.map((row) => ({
        id: row.id,
        amount: row.amount,
        categoryId: row.categoryId,
        walletId: row.walletId,
        secondWalletId: row.secondWalletId,
        date: row.date,
        title: row.title,
        description: row.description,
        type: row.type,
        categoryName: row.categoryName,
        categoryIcon: row.categoryIcon,
        categoryBackground: row.categoryBackground,
        walletName: row.walletName,
        secondWalletName: row.secondWalletName,
      }));
    } catch (error) {
      throw new DatabaseError(
        "Failed to get transactions",
        "getTransactions",
        error
      );
    }
  }

  async updateTransaction(transactionData) {
    try {
      const validatedTransaction = this.validateInput(
        transactionData,
        VALIDATION_SCHEMAS.transaction
      );

      return await this.withTransaction(async () => {
        // Get the old transaction to calculate balance difference
        const oldTransaction = await this.db.getFirstAsync(
          "SELECT amount, walletId, secondWalletId, type FROM transactions WHERE id = ?",
          [validatedTransaction.id]
        );

        if (!oldTransaction) {
          throw new DatabaseError("Transaction not found", "updateTransaction");
        }

        // Revert old wallet balance changes
        if (oldTransaction.type === "transfer") {
          await this.updateWalletBalance(
            oldTransaction.walletId,
            Math.abs(oldTransaction.amount)
          );
          if (oldTransaction.secondWalletId) {
            await this.updateWalletBalance(
              oldTransaction.secondWalletId,
              -Math.abs(oldTransaction.amount)
            );
          }
        } else {
          await this.updateWalletBalance(
            oldTransaction.walletId,
            -oldTransaction.amount
          );
        }

        // Update transaction
        await this.db.runAsync(
          "UPDATE transactions SET amount = ?, categoryId = ?, walletId = ?, secondWalletId = ?, date = ?, title = ?, description = ?, type = ? WHERE id = ?",
          [
            validatedTransaction.amount,
            validatedTransaction.categoryId,
            validatedTransaction.walletId,
            validatedTransaction.secondWalletId,
            validatedTransaction.date,
            validatedTransaction.title,
            validatedTransaction.description,
            validatedTransaction.type,
            validatedTransaction.id,
          ]
        );

        // Apply new wallet balance changes
        if (validatedTransaction.type === "transfer") {
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            -Math.abs(validatedTransaction.amount)
          );
          if (validatedTransaction.secondWalletId) {
            await this.updateWalletBalance(
              validatedTransaction.secondWalletId,
              Math.abs(validatedTransaction.amount)
            );
          }
        } else if (validatedTransaction.type === "expense") {
          // For expenses, subtract the amount (negative)
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            -Math.abs(validatedTransaction.amount)
          );
        } else if (validatedTransaction.type === "income") {
          // For income, add the amount (positive)
          await this.updateWalletBalance(
            validatedTransaction.walletId,
            Math.abs(validatedTransaction.amount)
          );
        }

        return validatedTransaction;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to update transaction",
        "updateTransaction",
        error
      );
    }
  }

  async deleteTransaction(id) {
    try {
      if (!id || typeof id !== "string") {
        throw new DatabaseError("Invalid transaction ID", "deleteTransaction");
      }

      return await this.withTransaction(async () => {
        // Get transaction details before deletion
        const transaction = await this.db.getFirstAsync(
          "SELECT amount, walletId, secondWalletId, type FROM transactions WHERE id = ?",
          [id]
        );

        if (!transaction) {
          throw new DatabaseError("Transaction not found", "deleteTransaction");
        }

        // Revert wallet balance changes
        if (transaction.type === "transfer") {
          await this.updateWalletBalance(
            transaction.walletId,
            Math.abs(transaction.amount)
          );
          if (transaction.secondWalletId) {
            await this.updateWalletBalance(
              transaction.secondWalletId,
              -Math.abs(transaction.amount)
            );
          }
        } else {
          await this.updateWalletBalance(
            transaction.walletId,
            -transaction.amount
          );
        }

        // Delete transaction
        await this.db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to delete transaction",
        "deleteTransaction",
        error
      );
    }
  }

  // Helper method to update wallet balance
  async updateWalletBalance(walletId, amountChange) {
    try {
      const result = await this.db.runAsync(
        "UPDATE wallets SET balance = balance + ? WHERE id = ?",
        [amountChange, walletId]
      );

      if (result.changes === 0) {
        throw new DatabaseError(
          "Wallet not found for balance update",
          "updateWalletBalance"
        );
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to update wallet balance",
        "updateWalletBalance",
        error
      );
    }
  }

  // Analytics methods
  async getTotalBalance() {
    try {
      // Ensure database is initialized
      if (!this.isInitialized || !this.db) {
        console.warn("Database not initialized, returning 0");
        return 0;
      }

      const result = await this.db.getFirstAsync(
        "SELECT SUM(balance) as total FROM wallets"
      );
      return result?.total || 0;
    } catch (error) {
      console.error("Error getting total balance:", error);
      // Return 0 instead of throwing error to prevent app crash
      return 0;
    }
  }

  async getTransactionsByCategory(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new DatabaseError(
          "Start date and end date are required",
          "getTransactionsByCategory"
        );
      }

      const result = await this.db.getAllAsync(
        `
        SELECT c.name as categoryName, SUM(t.amount) as total, COUNT(*) as count
        FROM transactions t
        LEFT JOIN categories c ON t.categoryId = c.id
        WHERE t.date >= ? AND t.date <= ?
        GROUP BY t.categoryId, c.name
        ORDER BY total DESC
      `,
        [startDate, endDate]
      );

      return result;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to get transactions by category",
        "getTransactionsByCategory",
        error
      );
    }
  }

  async getTransactionsByWallet(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new DatabaseError(
          "Start date and end date are required",
          "getTransactionsByWallet"
        );
      }

      const result = await this.db.getAllAsync(
        `
        SELECT w.name as walletName, SUM(t.amount) as total, COUNT(*) as count
        FROM transactions t
        LEFT JOIN wallets w ON t.walletId = w.id
        WHERE t.date >= ? AND t.date <= ?
        GROUP BY t.walletId, w.name
        ORDER BY total DESC
      `,
        [startDate, endDate]
      );

      return result;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        "Failed to get transactions by wallet",
        "getTransactionsByWallet",
        error
      );
    }
  }

  // Utility methods
  async clearAllData() {
    try {
      // Ensure database is initialized
      if (!this.isInitialized || !this.db) {
        console.warn("Database not initialized, cannot clear data");
        return false;
      }

      return await this.withTransaction(async () => {
        await this.db.runAsync("DELETE FROM transactions");
        await this.db.runAsync("DELETE FROM categories");
        await this.db.runAsync("DELETE FROM wallets");
        await this.db.runAsync("DELETE FROM migrations");
      });
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  }

  // Clear database file and reinitialize
  async clearDatabaseFile() {
    try {
      // Close the current database connection
      if (this.db) {
        await this.db.closeAsync();
        this.db = null;
      }

      // Reset initialization state
      this.isInitialized = false;
      this.currentVersion = 0;

      // Reinitialize the database
      await this.init();
      return true;
    } catch (error) {
      console.error("Error clearing database file:", error);
      return false;
    }
  }

  async resetDatabase() {
    try {
      await this.db.execAsync("DROP TABLE IF EXISTS transactions");
      await this.db.execAsync("DROP TABLE IF EXISTS wallets");
      await this.db.execAsync("DROP TABLE IF EXISTS categories");
      await this.db.execAsync("DROP TABLE IF EXISTS migrations");

      this.isInitialized = false;
      this.currentVersion = 0;

      await this.init();
      return true;
    } catch (error) {
      throw new DatabaseError(
        "Failed to reset database",
        "resetDatabase",
        error
      );
    }
  }

  // Get database status
  async getDatabaseStatus() {
    try {
      const migrationResult = await this.db.getAllAsync(
        "SELECT * FROM migrations ORDER BY version DESC"
      );
      const categoryCount = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM categories"
      );
      const walletCount = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM wallets"
      );
      const transactionCount = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM transactions"
      );

      return {
        isInitialized: this.isInitialized,
        currentVersion: this.currentVersion,
        migrations: migrationResult,
        counts: {
          categories: categoryCount?.count || 0,
          wallets: walletCount?.count || 0,
          transactions: transactionCount?.count || 0,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        "Failed to get database status",
        "getDatabaseStatus",
        error
      );
    }
  }
}

// Export a singleton instance
const databaseService = new DatabaseService();
export default databaseService;
