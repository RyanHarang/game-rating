import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Rating from "./pages/Rating";
import GameDetails from "./pages/GameDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="rating" element={<Rating />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="game" element={<GameDetails />} />
          <Route path="game/:id" element={<GameDetails />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
