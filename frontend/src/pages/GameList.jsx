import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";
import "../css/GameCard.css";
import axios from "axios";

export default function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/games");
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  return (
    <>
      <div className="card-grid">
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
      {/* <ul className="game-box">
        <li>
          <Link to="/game/1" className="game">
            <img className="game-image" src={g1} alt="Game one" />
          </Link>
        </li>
        <li>
          <Link to="/game/2" className="game">
            <img className="game-image" src={g2} alt="Game two" />
          </Link>
        </li>
      </ul> */}
    </>
  );
}
