// React Query Configuration
// Centralized configuration for better maintainability

export const QUERY_CONFIG = {
  // Default query options
  queries: {
    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.status >= 400 && error?.status < 500) return false;
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    // Cache configuration - optimized for better performance
    staleTime: 10 * 60 * 1000, // 10 minutes - data considered fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - how long to keep unused data

    // Performance optimizations
    refetchOnWindowFocus: false, // Prevent unnecessary refetches on focus
    refetchOnReconnect: true, // Refetch when connection is restored
    refetchOnMount: false, // Don't refetch on mount by default

    // Network behavior
    networkMode: "online", // Only run queries when online

    // Error handling
    throwOnError: false, // Don't throw errors, let components handle them

    // Suspense support (if using React Suspense)
    suspense: false,
  },

  // Default mutation options
  mutations: {
    retry: 1, // Retry failed mutations once
    retryDelay: 1000,
    networkMode: "online",
    throwOnError: false,
  },
};

// Domain-specific configurations - optimized for real-world usage patterns
export const DOMAIN_CONFIG = {
  // Wallets - change moderately, but not on every screen focus
  wallets: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // Categories - change very rarely, can be cached longer
  categories: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // Transactions - change frequently, but not every 30 seconds
  transactions: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // Total balance - changes with transactions, but can be cached briefly
  totalBalance: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // Analytics data - change less frequently, can be cached longer
  analytics: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // Database initialization - only once, never refetch
  databaseInit: {
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
};

// Helper function to get domain-specific config
export const getDomainConfig = (domain) => {
  return DOMAIN_CONFIG[domain] || {};
};

// Helper function to merge default config with domain config
export const mergeConfig = (domain, customConfig = {}) => {
  const domainConfig = getDomainConfig(domain);
  return {
    ...QUERY_CONFIG.queries,
    ...domainConfig,
    ...customConfig,
  };
};
