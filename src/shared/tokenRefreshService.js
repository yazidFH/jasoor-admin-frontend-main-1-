import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  shouldRefreshToken,
  isAuthenticated,
  isRefreshTokenExpired,
} from "./tokenManager";
import { REFRESH_TOKEN } from "../graphql/mutation/login";

let isRefreshing = false;
let refreshSubscribers = [];
let cachedClient = null;

/**
 * Get Apollo Client lazily to avoid circular dependency
 */
const getClient = async () => {
  if (!cachedClient) {
    const { client } = await import("../config/apolloClient");
    cachedClient = client;
  }
  return cachedClient;
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const refreshAccessToken = async () => {
  // If already refreshing, wait for that to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("❌ No refresh token available - cannot refresh");
    clearAuthTokens();
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return null;
  }

  isRefreshing = true;

  try {
    // Get Apollo Client lazily to avoid circular dependency
    const client = await getClient();

    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken },
      fetchPolicy: "no-cache",
      context: {
        // Skip the authLink for this request to avoid infinite loop
        skipAuth: true,
      },
    });

    if (data?.refreshToken?.token) {
      const {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      } = data.refreshToken;

      // Store new tokens
      setAuthTokens(newAccessToken, newRefreshToken, user);

      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);

      isRefreshing = false;
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response - no token in response");
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error.message || error);

    // Check if it's a refresh token expiration error
    const isTokenExpired =
      error.message?.includes("Token is invalid or expired") ||
      error.message?.includes("jwt expired") ||
      error.message?.includes("refresh token") ||
      error.message?.includes("expired") ||
      error.graphQLErrors?.[0]?.message?.includes("expired");

    if (isTokenExpired) {
      console.error("🚨 Refresh token has expired - user must login again");
    }

    // Clear auth data
    clearAuthTokens();
    isRefreshing = false;

    // Notify waiting requests with null
    onTokenRefreshed(null);

    // Trigger logout event to update UI
    window.dispatchEvent(new CustomEvent("forceLogout"));

    // Only redirect if we're not already on login page
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      window.location.href = "/";
    }

    return null;
  }
};

export const ensureValidToken = async () => {
  // First check if we have any tokens at all
  const hasRefresh = !!getRefreshToken();

  if (!hasRefresh) {
    console.error("❌ No refresh token - cannot ensure valid token");
    clearAuthTokens();
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  // Check if refresh token itself is expired (time-based check)
  if (isRefreshTokenExpired()) {
    console.error("🚨 Refresh token has expired (time-based) - logging out");
    clearAuthTokens();
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  if (!isAuthenticated()) {
    // Access token missing but refresh token exists - try to recover
    const newToken = await refreshAccessToken();
    return !!newToken;
  }

  if (shouldRefreshToken()) {
    const newToken = await refreshAccessToken();
    return !!newToken;
  }

  return true; // Token is still valid
};

/**
 * Initialize authentication on app load
 * Handles the case where access token expired but refresh token still valid
 * This fixes the "stay logged in overnight" scenario
 */
export const initializeAuth = async () => {
  const hasAccess = isAuthenticated();
  const hasRefresh = !!getRefreshToken();
  const refreshExpired = isRefreshTokenExpired();

  // Case 1: No tokens at all - user not logged in
  if (!hasAccess && !hasRefresh) {
    return false;
  }

  // Case 2: Refresh token is expired - logout
  if (refreshExpired) {
    console.error("🚨 Refresh token has expired - user must login again");
    clearAuthTokens();
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  // Case 3: Has access token - check if needs refresh
  if (hasAccess) {
    if (shouldRefreshToken()) {
      const newToken = await refreshAccessToken();
      return !!newToken;
    }
    return true;
  }

  // Case 4: Access token missing but refresh token exists and is valid
  // This happens when user comes back after access token expired (>10 min)
  if (!hasAccess && hasRefresh && !refreshExpired) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

let autoRefreshInterval = null;

export const startAutoRefresh = async () => {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // First, initialize/recover authentication
  const isAuth = await initializeAuth();

  if (!isAuth) {
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  // Check token every 3 minutes (ensures we catch 8-minute threshold)
  autoRefreshInterval = setInterval(async () => {
    const hasRefresh = !!getRefreshToken();
    isAuthenticated();
    // If both tokens are missing, stop auto-refresh and logout
    if (!hasRefresh) {
      console.error(
        "🚨 No refresh token found - stopping auto-refresh and logging out"
      );
      stopAutoRefresh();
      clearAuthTokens();
      // Trigger logout event
      window.dispatchEvent(new CustomEvent("forceLogout"));

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/";
      }
      return;
    }

    // Try to ensure we have a valid token
    const isValid = await ensureValidToken();

    if (!isValid) {
      console.error("⚠️ Token validation failed - stopping auto-refresh");
      stopAutoRefresh();
    }
  }, 3 * 60 * 1000); // 3 minutes

  return true;
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

export const handleLogout = () => {
  stopAutoRefresh();
  clearAuthTokens();
  window.location.href = "/";
};
