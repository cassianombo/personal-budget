import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiService from "../ApiService";

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiService.get("/accounts"),
  });

  const getAccountById = (id) => {
    return useQuery({
      queryKey: ["account", id],
      queryFn: () => apiService.get(`/accounts/${id}`),
      enabled: !!id,
    });
  };

  const createAccount = useMutation({
    mutationFn: (accountData) => apiService.post("/accounts", accountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, ...accountData }) =>
      apiService.put(`/accounts/${id}`, accountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: (id) => apiService.delete(`/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return {
    accountsQuery,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};
