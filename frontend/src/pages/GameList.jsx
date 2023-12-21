import React, { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import "../css/GameCard.css";
import axios from "axios";

export default function GameList() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/games");
        setGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="card-grid">
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </>
  );
}
