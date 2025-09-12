import apiService from "../ApiService";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiService.get("/categories"),
  });

  return {
    categoriesQuery,
  };
};
