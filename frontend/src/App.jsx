import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import "./css/RequestCard.css";
import "./css/GameCard.css";
import "./css/GameDetails.css";
import "./css/Forms.css";
import GameList from "./pages/GameList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddGame from "./pages/AddGame";
import GameDetails from "./pages/GameDetails";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game/:name" element={<GameDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
