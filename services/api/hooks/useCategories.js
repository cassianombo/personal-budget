import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "../endpoints";
import apiService from "../ApiService";

export const CATEGORY_QUERY_KEYS = {
  all: ["categories"],
  detail: (id) => ["categories", id],
  byUser: (userId) => ["categories", "user", userId],
};

export const useCategories = (userId) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.byUser(userId),
    queryFn: () => apiService.get(API_ENDPOINTS.CATEGORIES.BY_USER(userId)),
    enabled: !!userId,
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id),
    queryFn: () => apiService.get(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) =>
      apiService.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: CATEGORY_QUERY_KEYS.byUser(variables.userId),
        });
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...categoryData }) =>
      apiService.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiService.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
  });
};
