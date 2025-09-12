import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiService from "../ApiService";

export const useUsers = (shouldLoadUserData = false) => {
  const queryClient = useQueryClient();

  // Perfil do usuário atual
  const userProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => apiService.get("/users/profile"),
    staleTime: Infinity,
    enabled: shouldLoadUserData,
  });

  // Opções de configurações do usuário
  const userSettingsOptions = useQuery({
    queryKey: ["userSettingsOptions"],
    queryFn: () => apiService.get("/users/settings/options"),
    staleTime: Infinity,
    enabled: shouldLoadUserData,
  });

  // Atualizar perfil do usuário
  const updateUserProfile = useMutation({
    mutationFn: (userData) => apiService.put("/users/profile", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    // Queries
    userProfile,
    userSettingsOptions,

    // Mutations
    updateUserProfile,
  };
};
