import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "../endpoints";
import apiService from "../ApiService";

// Query keys para consistência
export const USER_QUERY_KEYS = {
  all: ["users"],
  detail: (id) => ["users", id],
  profile: ["users", "profile"],
};

// Hook para buscar perfil do usuário
export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile,
    queryFn: () => apiService.get(API_ENDPOINTS.USERS.PROFILE),
  });
};

// Hook para buscar usuário por ID
export const useUser = (id) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => apiService.get(API_ENDPOINTS.USERS.BY_ID(id)),
    enabled: !!id,
  });
};

// Hook para atualizar perfil do usuário
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) =>
      apiService.put(API_ENDPOINTS.USERS.PROFILE, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile });
    },
  });
};

// Hook para deletar usuário
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiService.delete(API_ENDPOINTS.USERS.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};
