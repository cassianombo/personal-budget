export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },

  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
    PROFILE: "/users/profile",
  },

  ACCOUNTS: {
    BASE: "/accounts",
    BY_ID: (id) => `/accounts/${id}`,
    BY_USER: (userId) => `/accounts/user/${userId}`,
  },

  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id) => `/categories/${id}`,
    BY_USER: (userId) => `/categories/user/${userId}`,
  },

  TRANSACTIONS: {
    BASE: "/transactions",
    BY_ID: (id) => `/transactions/${id}`,
    // Note: Use BASE endpoint with accountId filter instead of BY_ACCOUNT
    BY_USER: (userId) => `/transactions/user/${userId}`,
    // Note: Use BASE endpoint with categoryId filter instead of BY_CATEGORY
  },
};
