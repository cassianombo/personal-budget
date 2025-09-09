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
    BY_ACCOUNT: (accountId) => `/transactions/account/${accountId}`,
    BY_USER: (userId) => `/transactions/user/${userId}`,
    BY_CATEGORY: (categoryId) => `/transactions/category/${categoryId}`,
  },
};
