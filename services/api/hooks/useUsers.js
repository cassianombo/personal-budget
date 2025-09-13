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

  // Atualizar perfil do usuário
  const updateUserProfile = useMutation({
    mutationFn: (userData) => apiService.put("/users/profile", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const useUserSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => apiService.get("/users/profile/settings"),
  });

  const updateUserSettings = useMutation({
    mutationFn: (settingsData) =>
      apiService.patch("/users/profile/settings", settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });

  return {
    userProfile,
    updateUserProfile,
    updateUserSettings,
    useUserSettings,
  };
};
