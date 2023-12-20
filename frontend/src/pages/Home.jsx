import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";
import axios from "axios";
// import g1 from "../assets/images/g1.jpg";
// import g2 from "../assets/images/g2.jpg";

export default function Home() {
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
      <h1>Home</h1>
      <p>This is the homepage</p>
      <div className="game-grid">
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
