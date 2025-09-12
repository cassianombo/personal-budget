import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiService from "../ApiService";

export const TRANSACTION_QUERY_KEYS = {
  all: ["transactions"],
  detail: (id) => ["transactions", id],
  byAccount: (accountId) => ["transactions", "account", accountId],
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiService.get("/transactions"),
  });

  const getTransactionById = (id) => {
    return useQuery({
      queryKey: ["transaction", id],
      queryFn: () => apiService.get(`/transactions/${id}`),
      enabled: !!id,
    });
  };

  const useTransactionsByAccount = (accountId, options = {}) => {
    const { startDate, endDate, limit, offset } = options;

    return useQuery({
      queryKey: TRANSACTION_QUERY_KEYS.byAccount(accountId),
      queryFn: async () => {
        try {
          let url = "/transactions";
          const params = new URLSearchParams();

          // Add accountId as filter
          if (accountId) params.append("accountId", accountId.toString());
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
          if (limit) params.append("limit", limit);
          if (offset) params.append("offset", offset);

          if (params.toString()) {
            url += `?${params.toString()}`;
          }

          return await apiService.get(url);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          throw error;
        }
      },
      enabled: !!accountId,
      staleTime: 30 * 1000,
      retry: 2,
      retryDelay: 1000,
    });
  };

  const createTransaction = useMutation({
    mutationFn: (transactionData) =>
      apiService.post("/transactions", transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, ...transactionData }) =>
      apiService.put(`/transactions/${id}`, transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: (id) => apiService.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    transactionsQuery,
    getTransactionById,
    useTransactionsByAccount,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
