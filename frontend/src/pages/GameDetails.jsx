import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function GameDetails() {
  const { name } = useParams();
  const { isGuest, user } = useAuth();
  const [score, setScore] = useState(5);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/games/${name}`);
        setGameData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };
    fetchGameData();
  }, [name]);

  const axiosPostData = async () => {
    const postData = {
      username: user,
      game: name,
      score: score,
    };
    try {
      await axios.post("http://localhost:4000/ratings/upload-rating", postData);
      const response = await axios.get(`http://localhost:4000/games/${name}`);
      setGameData(response.data);
      setScore(5);
    } catch (error) {
      console.error("Error posting rating:", error);
    }
  };

  const getUserRating = () => {
    const userRating = gameData.ratings.find(
      (rating) => rating.username === user
    );
    return userRating !== undefined ? userRating.score : null;
  };

  const calculateAverageRating = () => {
    const { ratings } = gameData;
    if (ratings.length === 0) return 0;
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return totalScore / ratings.length;
  };

  const handleScoreChange = (e) => {
    setScore(parseFloat(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosPostData();
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="game-details">
        <Link to="/" className="back-link">
          &#8592;
        </Link>
        {gameData ? (
          <>
            <h1 className="details-title">
              <a className="site" href={gameData.game.site} target="_blank">
                {name}
              </a>
            </h1>
            <img
              src={gameData.game.imageUrl}
              alt={gameData.game.title}
              className="details-image"
            />
            {isGuest ? (
              <Link to="/login" className="login-link">
                Login to rate games
              </Link>
            ) : (
              <form
                className="rating-form details-form"
                onSubmit={handleSubmit}
              >
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={score}
                  onChange={handleScoreChange}
                  className="score-input"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={score}
                  onChange={handleScoreChange}
                  className="score-slider"
                />
                <button type="submit" className="process">
                  Submit
                </button>
              </form>
            )}
            {gameData.ratings.length > 0 && (
              <h3 className="info">
                Average: {calculateAverageRating().toFixed(2)}
              </h3>
            )}
            {!isGuest && (
              <h3 className="info">
                Your Rating:{" "}
                {getUserRating() !== null ? getUserRating() : "None"}
              </h3>
            )}
            <h3 className="info">All Ratings:</h3>
            <div className="ratings-container">
              <ul className="ratings-list">
                {gameData.ratings
                  .sort((a, b) => b.score - a.score)
                  .map((rating) => (
                    <li key={rating._id}>
                      {rating.username}: {rating.score}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        ) : (
          "No Game Data Found"
        )}
      </div>
    </>
  );
}
