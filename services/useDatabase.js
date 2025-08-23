import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import databaseService from "./DatabaseService";
import { mergeConfig } from "./queryConfig";

// Query Keys - organized by domain for better cache management
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
    queryFn: () => databaseService.getWallets(),
    ...mergeConfig("wallets", {
      enabled: dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

// Hook to get a specific wallet with real-time updates
export const useWallet = (walletId) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.WALLETS, "detail", walletId],
    queryFn: () => databaseService.getWallet(walletId),
    ...mergeConfig("wallets", {
      enabled: !!walletId && dbInit?.initialized === true,
      keepPreviousData: true,
      // Use existing data as placeholder to avoid loading states
      placeholderData: () => {
        const allWallets = queryClient.getQueryData([QUERY_KEYS.WALLETS]);
        return allWallets?.find((w) => w.id === walletId) || null;
      },
    }),
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletData) => databaseService.createWallet(walletData),
    onSuccess: (newWallet) => {
      // ✅ Update cache optimistically
      queryClient.setQueryData([QUERY_KEYS.WALLETS], (oldData) => [
        ...(oldData || []),
        newWallet,
      ]);

      // ✅ Selective invalidation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wallet) => databaseService.updateWallet(wallet),
    onSuccess: (updatedWallet) => {
      // ✅ Update cache optimistically for wallets list
      queryClient.setQueryData(
        [QUERY_KEYS.WALLETS],
        (oldData) =>
          oldData?.map((w) =>
            w.id === updatedWallet.id ? updatedWallet : w
          ) || []
      );

      // ✅ Update cache for any wallet-specific queries
      queryClient.setQueryData(
        [QUERY_KEYS.WALLETS, "detail", updatedWallet.id],
        updatedWallet
      );

      // ✅ Selective invalidation for total balance
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });

      // ✅ Force re-render of components using this wallet
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLETS],
        exact: false,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteWallet(id),
    onSuccess: (_, deletedId) => {
      // ✅ Update cache optimistically
      queryClient.setQueryData(
        [QUERY_KEYS.WALLETS],
        (oldData) => oldData?.filter((w) => w.id !== deletedId) || []
      );

      // ✅ Selective invalidation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS],
        exact: false,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
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
    ...mergeConfig("categories", {
      enabled: dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => databaseService.createCategory(categoryData),
    onSuccess: (newCategory) => {
      // ✅ Update cache optimistically
      queryClient.setQueryData([QUERY_KEYS.CATEGORIES], (oldData) => [
        ...(oldData || []),
        newCategory,
      ]);
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category) => databaseService.updateCategory(category),
    onSuccess: (updatedCategory) => {
      // ✅ Update cache optimistically
      queryClient.setQueryData(
        [QUERY_KEYS.CATEGORIES],
        (oldData) =>
          oldData?.map((c) =>
            c.id === updatedCategory.id ? updatedCategory : c
          ) || []
      );
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // ✅ Update cache optimistically
      queryClient.setQueryData(
        [QUERY_KEYS.CATEGORIES],
        (oldData) => oldData?.filter((c) => c.id !== deletedId) || []
      );

      // ✅ Selective invalidation for related transactions
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS],
        exact: false,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

// Transaction Hooks
export const useTransactions = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: () => databaseService.getTransactions(),
    ...mergeConfig("transactions", {
      enabled: dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

export const useTransactionsByWalletId = (walletId) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "wallet", walletId],
    queryFn: () => databaseService.getTransactions({ walletId }),
    ...mergeConfig("transactions", {
      enabled: !!walletId && dbInit?.initialized === true,
      keepPreviousData: true,
      // ✅ Use existing data as placeholder to avoid loading states
      placeholderData: () => {
        const allTransactions = queryClient.getQueryData([
          QUERY_KEYS.TRANSACTIONS,
        ]);
        return allTransactions?.filter((t) => t.walletId === walletId) || [];
      },
    }),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData) =>
      databaseService.createTransaction(transactionData),
    onSuccess: (newTransaction) => {
      // ✅ Update main transactions cache optimistically
      queryClient.setQueryData([QUERY_KEYS.TRANSACTIONS], (oldData) => [
        ...(oldData || []),
        newTransaction,
      ]);

      // ✅ Update wallet-specific queries if they exist
      if (newTransaction.walletId) {
        queryClient.setQueryData(
          [QUERY_KEYS.TRANSACTIONS, "wallet", newTransaction.walletId],
          (oldData) => [...(oldData || []), newTransaction]
        );
      }

      // ✅ Selective invalidation for total balance
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction) => databaseService.updateTransaction(transaction),
    onSuccess: (updatedTransaction) => {
      // ✅ Update main transactions cache optimistically
      queryClient.setQueryData(
        [QUERY_KEYS.TRANSACTIONS],
        (oldData) =>
          oldData?.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
          ) || []
      );

      // ✅ Update wallet-specific queries if they exist
      if (updatedTransaction.walletId) {
        queryClient.setQueryData(
          [QUERY_KEYS.TRANSACTIONS, "wallet", updatedTransaction.walletId],
          (oldData) =>
            oldData?.map((t) =>
              t.id === updatedTransaction.id ? updatedTransaction : t
            ) || []
        );
      }

      // ✅ Selective invalidation for total balance
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => databaseService.deleteTransaction(id),
    onSuccess: (_, deletedId) => {
      // ✅ Update main transactions cache optimistically
      queryClient.setQueryData(
        [QUERY_KEYS.TRANSACTIONS],
        (oldData) => oldData?.filter((t) => t.id !== deletedId) || []
      );

      // ✅ Update all wallet-specific queries
      const allTransactions = queryClient.getQueryData([
        QUERY_KEYS.TRANSACTIONS,
      ]);
      const deletedTransaction = allTransactions?.find(
        (t) => t.id === deletedId
      );

      if (deletedTransaction?.walletId) {
        queryClient.setQueryData(
          [QUERY_KEYS.TRANSACTIONS, "wallet", deletedTransaction.walletId],
          (oldData) => oldData?.filter((t) => t.id !== deletedId) || []
        );
      }

      // ✅ Selective invalidation for total balance
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOTAL_BALANCE],
        exact: true,
      });
    },
    onError: (error) => {
      // Silent error handling - let UI components handle display
    },
  });
};

// Analytics Hooks
export const useTotalBalance = () => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TOTAL_BALANCE],
    queryFn: () => databaseService.getTotalBalance(),
    ...mergeConfig("totalBalance", {
      enabled: dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

export const useTransactionsByCategory = (startDate, endDate) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS_BY_CATEGORY, startDate, endDate],
    queryFn: () =>
      databaseService.getTransactionsByCategory(startDate, endDate),
    ...mergeConfig("analytics", {
      enabled: !!startDate && !!endDate && dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

export const useTransactionsByWallet = (startDate, endDate) => {
  const queryClient = useQueryClient();
  const dbInit = queryClient.getQueryData(["databaseInit"]);

  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS_BY_WALLET, startDate, endDate],
    queryFn: () => databaseService.getTransactionsByWallet(startDate, endDate),
    ...mergeConfig("analytics", {
      enabled: !!startDate && !!endDate && dbInit?.initialized === true,
      keepPreviousData: true,
    }),
  });
};

// Utility Hooks
export const useDatabaseInitialization = () => {
  return useQuery({
    queryKey: ["databaseInit"],
    queryFn: async () => {
      try {
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

        return {
          initialized: true,
          timestamp: new Date().toISOString(),
          status: "success",
        };
      } catch (error) {
        // Throw the error so React Query can handle it properly
        throw new Error(`Database initialization failed: ${error.message}`);
      }
    },
    ...mergeConfig("databaseInit"),
  });
};

// Optimistic Updates Helper - Enhanced version
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

// Smart Refetch Helper - Only refetch if data is stale
export const useSmartRefetch = (query) => {
  return useCallback(() => {
    if (query.isStale && !query.isFetching) {
      query.refetch();
    }
  }, [query.isStale, query.isFetching, query.refetch]);
};

// Background Sync Hook - Intelligent background synchronization
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      // ✅ Only sync queries that are stale and not currently fetching
      queryClient.refetchQueries({
        predicate: (query) =>
          query.isStale &&
          !query.isFetching &&
          query.state.status === "success" &&
          !query.queryKey.includes("databaseInit"), // Don't sync database init
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  return {
    // Manual sync function
    syncAll: () => {
      queryClient.refetchQueries({
        predicate: (query) =>
          query.isStale &&
          !query.isFetching &&
          query.state.status === "success",
      });
    },

    // Sync specific domain
    syncDomain: (domain) => {
      const domainKeys = {
        wallets: [QUERY_KEYS.WALLETS],
        categories: [QUERY_KEYS.CATEGORIES],
        transactions: [QUERY_KEYS.TRANSACTIONS],
        totalBalance: [QUERY_KEYS.TOTAL_BALANCE],
      };

      const keys = domainKeys[domain];
      if (keys) {
        queryClient.refetchQueries({
          queryKey: keys,
          predicate: (query) => query.isStale && !query.isFetching,
        });
      }
    },
  };
};

// Prefetch Hook - Intelligent data prefetching
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchWallets = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.WALLETS],
      queryFn: () => databaseService.getWallets(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  const prefetchCategories = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.CATEGORIES],
      queryFn: () => databaseService.getCategories(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }, [queryClient]);

  const prefetchTotalBalance = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.TOTAL_BALANCE],
      queryFn: () => databaseService.getTotalBalance(),
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  }, [queryClient]);

  const prefetchAll = useCallback(() => {
    prefetchWallets();
    prefetchCategories();
    prefetchTotalBalance();
  }, [prefetchWallets, prefetchCategories, prefetchTotalBalance]);

  return {
    prefetchWallets,
    prefetchCategories,
    prefetchTotalBalance,
    prefetchAll,
  };
};
