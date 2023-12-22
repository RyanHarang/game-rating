import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

  const calculateAverageRating = () => {
    const { ratings } = gameData;
    if (ratings.length === 0) return 0;

    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return totalScore / ratings.length;
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="game-details">
        <Link to="/list" className="back-link">
          &#8592;
        </Link>
        {gameData ? (
          <>
            <h1 className="details-title">{name}</h1>
            <img
              src={gameData.game.imageUrl}
              alt={gameData.game.title}
              className="details-image"
            />
            {gameData.ratings.length > 0 && (
              <h3>Average Rating: {calculateAverageRating().toFixed(2)}</h3>
            )}
            <h3>Ratings:</h3>
            <ul className="rating-list">
              {gameData.ratings.map((rating) => (
                <li key={rating._id}>
                  {rating.username}: {rating.score}
                </li>
              ))}
            </ul>
          </>
        ) : (
          "No Game Data Found"
        )}
      </div>
    </>
  );
}
