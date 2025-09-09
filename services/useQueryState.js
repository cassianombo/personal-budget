import { useMemo } from "react";

export const useQueryState = (queries) => {
  return useMemo(() => {
    const isLoading = queries.some((query) => query.isLoading);
    const isError = queries.some((query) => query.isError);
    const error = queries.find((query) => query.error)?.error;
    const isSuccess = queries.every((query) => query.isSuccess);

    return {
      isLoading,
      isError,
      error,
      isSuccess,
      queries,
    };
  }, [queries]);
};

export const useCombinedQueries = (queries) => {
  const state = useQueryState(queries);

  const data = useMemo(() => {
    if (state.isLoading || state.isError) return null;

    return queries.reduce((acc, query, index) => {
      acc[`data${index + 1}`] = query.data;
      return acc;
    }, {});
  }, [queries, state.isLoading, state.isError]);

  return {
    ...state,
    data,
  };
};

export const useOptimisticMutation = (mutationFn, options = {}) => {
  const { onSuccess, onError, onMutate, ...rest } = options;

  return {
    mutate: async (variables) => {
      try {
        const previousData = onMutate?.(variables);

        const result = await mutationFn(variables);

        onSuccess?.(result, variables, previousData);

        return result;
      } catch (error) {
        onError?.(error, variables, options.previousData);
        throw error;
      }
    },
    ...rest,
  };
};
