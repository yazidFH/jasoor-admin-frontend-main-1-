// AuthContext.js
import { createContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  setAuthTokens,
  getUserData,
} from "../shared/tokenManager";
import {
  startAutoRefresh,
  stopAutoRefresh,
  handleLogout as serviceLogout,
} from "../shared/tokenRefreshService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userData, setUserData] = useState(getUserData());
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth and start auto-refresh on app load
  useEffect(() => {
    const initAuth = async () => {
      // Start auto-refresh service (it will handle auth recovery)
      const success = await startAutoRefresh();
      if (success) {
        setIsLoggedIn(true);
        setUserData(getUserData());
      } else {
        setIsLoggedIn(false);
        setUserData({});
      }

      setIsInitializing(false);
    };

    initAuth();

    // Listen for forced logout events (from Apollo error handler)
    const handleForceLogout = () => {
      setIsLoggedIn(false);
      setUserData({});
      stopAutoRefresh();
    };

    window.addEventListener("forceLogout", handleForceLogout);

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, []);

  const login = (token, refreshToken, user) => {
    // Reject Customer accounts — they cannot access the admin panel
    const roleName = user?.role?.name ?? user?.role ?? '';
    if (roleName === 'Customer' || !roleName) {
      return false;
    }

    setAuthTokens(token, refreshToken, user);
    setIsLoggedIn(true);
    setUserData(getUserData());

    // Start auto-refresh after login
    startAutoRefresh();
    return true;
  };

  const logout = () => {
    serviceLogout();
    setIsLoggedIn(false);
    setUserData({});
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userData,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
