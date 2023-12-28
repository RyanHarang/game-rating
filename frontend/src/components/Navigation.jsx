import React from "react";
import Header from "./Header";

const Navigation = () => {
  const shouldDisplayHeader = () => {
    const currentPath = window.location.pathname;
    // List of paths where the header should not be displayed
    const pathsWithoutHeader = ["/"];
    return !pathsWithoutHeader.includes(currentPath);
  };

  return shouldDisplayHeader() ? <Header /> : null;
};

export default Navigation;
