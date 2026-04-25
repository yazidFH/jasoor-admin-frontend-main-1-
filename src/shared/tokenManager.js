import Cookies from "js-cookie";

const TOKEN_CONFIG = {
  // Access token expires in 10 minutes (backend: '10m')
  ACCESS_TOKEN_EXPIRY: 10 / (24 * 60), // 10 minutes in days

  // Refresh token expires in 234 hours ≈ 9.75 days (backend: '234h')
  REFRESH_TOKEN_EXPIRY: 234 / 24, // 234 hours in days (9.75 days)

  // User data expiry (same as refresh token)
  USER_DATA_EXPIRY: 234 / 24, // 234 hours in days (9.75 days)

  // Cookie options - more permissive for localhost, secure for production
  SECURE_OPTIONS: {
    secure: window.location.protocol === "https:", // Only use secure flag on HTTPS
    sameSite: window.location.hostname === "localhost" ? "lax" : "strict", // Lax on localhost, strict in production
    path: "/", // Ensure cookies are available across all paths
  },
};

/**
 * Simple XOR encryption for token obfuscation
 * NOTE: This is NOT cryptographically secure, just obfuscation
 * Better than plaintext, but httpOnly cookies from backend are ideal
 */
const encryptToken = (token) => {
  if (!token) return "";
  const key = "J@$00r-S3cur3-K3y-2025"; // Should be in env variable
  let encrypted = "";
  for (let i = 0; i < token.length; i++) {
    encrypted += String.fromCharCode(
      token.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted); // Base64 encode
};

const decryptToken = (encrypted) => {
  if (!encrypted) return "";
  try {
    const key = "J@$00r-S3cur3-K3y-2025";
    const decoded = atob(encrypted);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return "";
  }
};
export const setAuthTokens = (accessToken, refreshToken, user) => {
  try {
    // Encrypt and store access token (short-lived)
    Cookies.set("_at", encryptToken(accessToken), {
      expires: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Encrypt and store refresh token (longer-lived)
    // SECURITY: In production, this should be httpOnly cookie set by backend
    Cookies.set("_rt", encryptToken(refreshToken), {
      expires: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Store user data (non-sensitive, can be plaintext)
    if (user) {
      Cookies.set("userId", user.id, {
        expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
      });

      Cookies.set("userStatus", user.status, {
        expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
      });
    }

    // IMPORTANT: Only set tokenIssuedAt on initial login, not on refresh
    // This tracks when the REFRESH token was first issued, not when access token was refreshed
    const existingIssuedAt = Cookies.get("tokenIssuedAt");
    if (!existingIssuedAt) {
      Cookies.set("tokenIssuedAt", new Date().toISOString(), {
        expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
      });
    }
    // Set when the access token was last refreshed (for 8-minute check)
    Cookies.set("tokenRefreshedAt", new Date().toISOString(), {
      expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
    });
    return true;
  } catch (error) {
    console.error("❌ Error setting auth tokens:", error);
    return false;
  }
};

export const getAccessToken = () => {
  const encrypted = Cookies.get("_at");
  return encrypted ? decryptToken(encrypted) : null;
};

export const getRefreshToken = () => {
  const encrypted = Cookies.get("_rt");
  return encrypted ? decryptToken(encrypted) : null;
};

export const getUserId = () => {
  return Cookies.get("userId") || null;
};

export const getUserStatus = () => {
  return Cookies.get("userStatus") || null;
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Check if user has valid session (access OR refresh token)
 * @returns {boolean} True if either token exists
 */
export const hasValidSession = () => {
  return !!getAccessToken() || !!getRefreshToken();
};

/**
 * Check if refresh token exists
 * @returns {boolean} True if refresh token exists
 */
export const hasRefreshToken = () => {
  return !!getRefreshToken();
};

/**
 * Clear all authentication data
 */
export const clearAuthTokens = () => {
  try {
    // Remove all auth-related cookies
    Cookies.remove("_at"); // access token
    Cookies.remove("_rt"); // refresh token
    Cookies.remove("userId");
    Cookies.remove("userStatus");
    Cookies.remove("tokenRefreshedAt"); // Last refresh time
    Cookies.remove("tokenIssuedAt"); // Token issue time (IMPORTANT!)

    // Clear localStorage as fallback (backward compatibility)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return true;
  } catch (error) {
    console.error("Error clearing auth tokens:", error);
    return false;
  }
};

/**
 * Check if refresh token is expired based on timestamp
 * @returns {boolean} True if refresh token is expired
 */
export const isRefreshTokenExpired = () => {
  const tokenIssuedAt = Cookies.get("tokenIssuedAt"); // Use ISSUE time, not refresh time

  if (!tokenIssuedAt) {
    console.warn("⚠️ No tokenIssuedAt found - considering token expired");
    return true; // No timestamp means token is expired
  }

  try {
    const issuedTime = new Date(tokenIssuedAt);
    const now = new Date();
    const hoursSinceIssue = (now - issuedTime) / (1000 * 60 * 60);
    // Refresh token expires in 234 hours
    // Consider it expired if more than 233 hours have passed (1 hour buffer)
    return hoursSinceIssue > 233;
  } catch (error) {
    console.error("Error checking refresh token expiry:", error);
    return true;
  }
};

export const shouldRefreshToken = () => {
  const lastRefresh = Cookies.get("tokenRefreshedAt");

  if (!lastRefresh) {
    return true; // No refresh timestamp, should refresh
  }

  try {
    const lastRefreshTime = new Date(lastRefresh);
    const now = new Date();
    const minutesSinceRefresh = (now - lastRefreshTime) / (1000 * 60);

    // Refresh if more than 8 minutes have passed (token expires in 10 minutes)
    // This gives 2 minutes buffer before actual expiration
    return minutesSinceRefresh > 8;
  } catch (error) {
    console.error("Error checking token refresh time:", error);
    return true; // On error, trigger refresh to be safe
  }
};

/**
 * Get all user data from cookies
 * @returns {object} User data object
 */
export const getUserData = () => {
  return {
    id: getUserId(),
    status: getUserStatus(),
    isAuthenticated: isAuthenticated(),
    hasRefreshToken: hasRefreshToken(),
  };
};

/**
 * Update only the access token (used after refresh)
 * @param {string} newAccessToken - New JWT access token
 */
export const updateAccessToken = (newAccessToken) => {
  try {
    Cookies.set("_at", encryptToken(newAccessToken), {
      expires: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Update refresh timestamp (NOT issue timestamp!)
    Cookies.set("tokenRefreshedAt", new Date().toISOString(), {
      expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
    });

    return true;
  } catch (error) {
    console.error("Error updating access token:", error);
    return false;
  }
};

/**
 * Diagnostic function to log all token-related information
 * Use this to debug token expiry issues
 */
export const debugTokenInfo = () => {
  const tokenIssuedAt = Cookies.get("tokenIssuedAt");
  const tokenRefreshedAt = Cookies.get("tokenRefreshedAt");
  const hasAccess = !!getAccessToken();
  const hasRefresh = !!getRefreshToken();

  const info = {
    hasAccessToken: hasAccess,
    hasRefreshToken: hasRefresh,
    tokenIssuedAt: tokenIssuedAt || "NOT SET",
    tokenRefreshedAt: tokenRefreshedAt || "NOT SET",
    userId: getUserId(),
    userStatus: getUserStatus(),
  };

  if (tokenIssuedAt) {
    const issued = new Date(tokenIssuedAt);
    const hoursSinceIssue = (new Date() - issued) / (1000 * 60 * 60);
    info.hoursSinceIssue = hoursSinceIssue.toFixed(2);
    info.daysUntilExpiry = ((234 - hoursSinceIssue) / 24).toFixed(2);
    info.isExpired = hoursSinceIssue > 233;
  }
  return info;
};
