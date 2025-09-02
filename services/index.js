// Query configuration (first to avoid circular deps)
export * from "./queryConfig";

// Query state management hooks (explicit exports to avoid conflicts)
export {
  useQueryState,
  useCombinedQueries,
  useOptimisticMutation,
} from "./useQueryState";

// Database service
export { default as databaseService } from "./DatabaseService";

// Database hooks (after query state)
export * from "./useDatabase";

// Database seeding
export * from "./databaseSeed";

// Settings service and hooks
export { default as settingsService } from "./SettingsService";
export { useSettings } from "./useSettings";

// Auth service
export { default as authService } from "./AuthService";
