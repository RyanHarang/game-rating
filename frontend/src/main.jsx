import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthContext.jsx";
import App from "./App.jsx";
import "./css/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
