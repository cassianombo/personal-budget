import apiService from "../ApiService";
import { useQuery } from "@tanstack/react-query";

export const useSettings = () => {
  const accountSettingsQuery = useQuery({
    queryKey: ["settings", "account-options"],
    queryFn: () => apiService.get("/settings/account-options"),
  });

  const userSettingsQuery = useQuery({
    queryKey: ["settings", "user-options"],
    queryFn: () => apiService.get("/settings/user-options"),
  });

  return {
    accountSettingsQuery,
    userSettingsQuery,
  };
};
