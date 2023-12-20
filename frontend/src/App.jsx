import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Rating from "./pages/Rating";
import GameDetails from "./pages/GameDetails";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>
    </>
  );
}
