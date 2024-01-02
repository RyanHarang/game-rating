import React, { useState, useEffect, useRef } from "react";
import GameCard from "../components/GameCard";
import ScrollButton from "../components/ScrollButton";
import axios from "axios";

export default function GameList() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollPosition, setScrollPosition] = useState(() => {
    const storedScrollPosition = localStorage.getItem("gameListScrollPosition");
    return storedScrollPosition ? parseInt(storedScrollPosition, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("gameListScrollPosition", scrollPosition.toString());
  }, [scrollPosition]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: scrollPosition });
  }, [games]);

  useEffect(() => {
    fetchGames();
  }, [searchTerm]);

  const fetchGames = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/games?search=${searchTerm}`
      );
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScroll = () => {
    requestAnimationFrame(() => {
      setScrollPosition(window.scrollY);
    });
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a game"
          value={searchTerm}
          onChange={handleSearchChange}
          className="field"
        />
      </div>
      <div className="card-grid">
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
      <ScrollButton />
    </>
  );
}
