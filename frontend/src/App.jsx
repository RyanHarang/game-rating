import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import "./css/GameCard.css";
import "./css/GameDetails.css";
import "./css/Forms.css";
import GameList from "./pages/GameList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Rating from "./pages/Rating";
import AddGame from "./pages/AddGame";
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
          <Route path="/list" element={<GameList />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game/:name" element={<GameDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
