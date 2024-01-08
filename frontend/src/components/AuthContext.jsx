import { createContext, useContext, useState } from "react";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = React.memo(({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (username, admin) => {
    setUser(username);
    setIsGuest(false);
    setIsAdmin(admin);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsGuest(true);
  };

  const contextValue = {
    user,
    isGuest,
    isAdmin,
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
