import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import databaseService from "./DatabaseService";

// Query Keys
export const QUERY_KEYS = {
  WALLETS: "wallets",
  CATEGORIES: "categories",
  TRANSACTIONS: "transactions",
  TOTAL_BALANCE: "totalBalance",
  TRANSACTIONS_BY_CATEGORY: "transactionsByCategory",
  TRANSACTIONS_BY_WALLET: "transactionsByWallet",
};

// Wallet Hooks
export const useWallets = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.WALLETS],
    queryFn: () => {
      console.log("Fetching wallets...");
      return databaseService.getWallets();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: dbInit?.initialized === true, // Only run when database is ready
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletData) => databaseService.createWallet(walletData),
    onSuccess: () => {
      // Invalidate and refetch wallets
      queryClient.invalidateQueries([QUERY_KEYS.WALLETS]);
      // Also invalidate total balance since it depends on wallets
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
    },
    onError: (error) => {
      console.error("Failed to create wallet:", error);
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wallet) => databaseService.updateWallet(wallet),
    onSuccess: (updatedWallet) => {
      console.log("Wallet updated successfully:", updatedWallet);
      queryClient.invalidateQueries([QUERY_KEYS.WALLETS]);
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
    },
    onError: (error) => {
      console.error("Failed to update wallet:", error);
    },
  });
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.WALLETS]);
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
      // Also invalidate transactions since they reference wallets
      queryClient.invalidateQueries([QUERY_KEYS.TRANSACTIONS]);
    },
    onError: (error) => {
      console.error("Failed to delete wallet:", error);
    },
  });
};

// Category Hooks
export const useCategories = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => databaseService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes - categories change less frequently
    enabled: dbInit?.initialized === true, // Only run when database is ready
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => databaseService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]);
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category) => databaseService.updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]);
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]);
      // Also invalidate transactions since they reference categories
      queryClient.invalidateQueries([QUERY_KEYS.TRANSACTIONS]);
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
    },
  });
};

// Transaction Hooks
export const useTransactions = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: () => {
      console.log("Fetching all transactions...");
      return databaseService.getTransactions();
    },
    staleTime: 1 * 60 * 1000, // 1 minute - transactions change frequently
    enabled: dbInit?.initialized === true, // Only run when database is ready
  });
};

export const useTransactionsByWalletId = (walletId) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "wallet", walletId],
    queryFn: () => {
      console.log("Fetching transactions for wallet:", walletId);
      return databaseService.getTransactions({ walletId });
    },
    staleTime: 1 * 60 * 1000, // 1 minute - transactions change frequently
    enabled: !!walletId && dbInit?.initialized === true, // Only run when database is ready
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData) =>
      databaseService.createTransaction(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TRANSACTIONS]);
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction) => databaseService.updateTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TRANSACTIONS]);
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
    },
    onError: (error) => {
      console.error("Failed to update transaction:", error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TRANSACTIONS]);
      queryClient.invalidateQueries([QUERY_KEYS.TOTAL_BALANCE]);
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
    },
  });
};

// Analytics Hooks
export const useTotalBalance = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TOTAL_BALANCE],
    queryFn: () => {
      console.log("Fetching total balance...");
      return databaseService.getTotalBalance();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: dbInit?.initialized === true, // Only run when database is ready
  });
};

export const useTransactionsByCategory = (startDate, endDate) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS_BY_CATEGORY, startDate, endDate],
    queryFn: () =>
      databaseService.getTransactionsByCategory(startDate, endDate),
    enabled: !!startDate && !!endDate && dbInit?.initialized === true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTransactionsByWallet = (startDate, endDate) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS_BY_WALLET, startDate, endDate],
    queryFn: () => databaseService.getTransactionsByWallet(startDate, endDate),
    enabled: !!startDate && !!endDate && dbInit?.initialized === true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Utility Hooks
export const useDatabaseInitialization = () => {
  return useQuery({
    queryKey: ["databaseInit"],
    queryFn: async () => {
      try {
        console.log("Starting database initialization...");

        // Check if database service exists
        if (!databaseService || typeof databaseService.init !== "function") {
          throw new Error("Database service not available");
        }

        // Initialize the database
        await databaseService.init();

        // Verify initialization was successful
        if (!databaseService.isInitialized) {
          throw new Error(
            "Database initialization failed - service not marked as initialized"
          );
        }

        console.log("Database initialized successfully!");

        return {
          initialized: true,
          timestamp: new Date().toISOString(),
          status: "success",
        };
      } catch (error) {
        console.error("Database initialization failed:", error);

        // Throw the error so React Query can handle it properly
        throw new Error(`Database initialization failed: ${error.message}`);
      }
    },
    staleTime: Infinity, // Only run once
    gcTime: Infinity, // Updated from cacheTime to gcTime for newer React Query versions
    retry: 2, // Retry a couple of times
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Optimistic Updates Helper
export const useOptimisticUpdate = (queryKey, updateFn) => {
  const queryClient = useQueryClient();

  return (data) => {
    // Optimistically update the cache
    queryClient.setQueryData(queryKey, (oldData) => {
      if (Array.isArray(oldData)) {
        return updateFn(oldData, data);
      }
      return oldData;
    });
  };
};
