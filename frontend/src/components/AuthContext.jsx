import { createContext, useContext, useState } from "react";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = React.memo(({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setIsGuest(false);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
  };

  const contextValue = {
    user,
    isGuest,
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
