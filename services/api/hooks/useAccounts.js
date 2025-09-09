import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "../endpoints";
import apiService from "../ApiService";

export const ACCOUNT_QUERY_KEYS = {
  all: ["accounts"],
  detail: (id) => ["accounts", id],
  byUser: (userId) => ["accounts", "user", userId],
};

export const useAccounts = (userId) => {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.byUser(userId),
    queryFn: () => apiService.get(API_ENDPOINTS.ACCOUNTS.BY_USER(userId)),
    enabled: !!userId,
  });
};

export const useAccount = (id) => {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.detail(id),
    queryFn: () => apiService.get(API_ENDPOINTS.ACCOUNTS.BY_ID(id)),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountData) =>
      apiService.post(API_ENDPOINTS.ACCOUNTS.BASE, accountData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: ACCOUNT_QUERY_KEYS.byUser(variables.userId),
        });
      }
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...accountData }) =>
      apiService.put(API_ENDPOINTS.ACCOUNTS.BY_ID(id), accountData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ACCOUNT_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiService.delete(API_ENDPOINTS.ACCOUNTS.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.all });
    },
  });
};
