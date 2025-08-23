import { useMemo } from "react";

/**
 * Custom hook to manage query states efficiently
 * Combines multiple query states into a single loading/error state
 */
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
      // Individual states for granular control
      queries,
    };
  }, [queries]);
};

/**
 * Hook to combine multiple query states with data
 * Useful for components that depend on multiple queries
 */
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

/**
 * Hook for optimistic updates with rollback on error
 * Useful for mutations that need to update multiple queries
 */
export const useOptimisticMutation = (mutationFn, options = {}) => {
  const { onSuccess, onError, onMutate, ...rest } = options;

  return {
    mutate: async (variables) => {
      try {
        // Store previous data for rollback
        const previousData = onMutate?.(variables);

        // Execute mutation
        const result = await mutationFn(variables);

        // Call success callback
        onSuccess?.(result, variables, previousData);

        return result;
      } catch (error) {
        // Call error callback with previous data for rollback
        onError?.(error, variables, options.previousData);
        throw error;
      }
    },
    ...rest,
  };
};
