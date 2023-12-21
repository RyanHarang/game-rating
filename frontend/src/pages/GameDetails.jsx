import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/GameDetails.css";
import axios from "axios";

export default function GameDetails() {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/game/${name}`);
        setGameData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameData();
  }, [name]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="game-details">
        {gameData ? (
          <>
            <h1 className="details-title">{name}</h1>
            <img
              src={gameData.imageUrl}
              alt={gameData.title}
              className="details-image"
            />
          </>
        ) : (
          "No Game Data Found"
        )}
      </div>
    </>
  );
}
