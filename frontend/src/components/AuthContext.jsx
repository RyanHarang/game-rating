import { createContext, useContext, useState } from "react";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = React.memo(({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsGuest(false);
    console.log(userData + " logged in");
  };

  const loginAsGuest = () => {
    setUser("Guest");
    setIsAuthenticated(true);
    setIsGuest(true);
    console.log("Logged in as Guest");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    console.log("Logged out");
  };

  const contextValue = {
    isAuthenticated,
    user,
    isGuest,
    login,
    loginAsGuest,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
});

export const useAuth = () => {
  return useContext(AuthContext);
};
