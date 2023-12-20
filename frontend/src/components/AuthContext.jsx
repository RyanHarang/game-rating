import { createContext, useContext, useState } from "react";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = React.memo(({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    console.log(userData.username + " logged in");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log("logged out");
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
});

export const useAuth = () => {
  return useContext(AuthContext);
};
