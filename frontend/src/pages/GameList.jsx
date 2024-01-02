import React, { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import axios from "axios";

export default function GameList() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollPosition, setScrollPosition] = useState(() => {
    const storedScrollPosition = sessionStorage.getItem(
      "gameListScrollPosition"
    );
    return storedScrollPosition ? parseInt(storedScrollPosition, 10) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("gameListScrollPosition", scrollPosition);
  }, [scrollPosition]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/games?search=${searchTerm}`
        );
        setGames(response.data);
        setLoading(false);
        const storedScrollPosition = sessionStorage.getItem(
          "gameListScrollPosition"
        );
        window.scrollTo(0, storedScrollPosition || 0);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    fetchGames();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
    </>
  );
}
