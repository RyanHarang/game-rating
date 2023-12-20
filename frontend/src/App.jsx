import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Rating from "./pages/Rating";
import GameDetails from "./pages/GameDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Navigation = () => {
  const navigate = useNavigate();
  const shouldDisplayHeader = () => {
    const currentPath = window.location.pathname;
    // List of paths where the header should not be displayed
    const pathsWithoutHeader = ["/"];
    return !pathsWithoutHeader.includes(currentPath);
  };

  return shouldDisplayHeader() ? <Header /> : null;
};

export default function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="rating" element={<Rating />} />
          <Route path="register" element={<Register />} />
          <Route path="game" element={<GameDetails />} />
          <Route path="game/:id" element={<GameDetails />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
