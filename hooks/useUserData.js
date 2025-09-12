import { useAuth } from "../contexts/AuthContext";

export const useUserData = () => {
  const { userData, fetchUserData, isLoading } = useAuth();

  return {
    userData,
    fetchUserData,
    isLoading,
  };
};

export const useUserSettings = () => {
  const { userData } = useAuth();

  const settings = userData?.settings || null;

  return {
    settings,
    hasSettings: !!settings,
  };
};
