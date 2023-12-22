import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Rating() {
  const { isGuest, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameOptions, setGameOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [game, setGame] = useState("");
  const [score, setScore] = useState(5); // Set an initial value for the slider
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/games");
        const games = response.data.map((game) => game.title);
        setGameOptions(games);
        setFilteredOptions(games);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const handleScoreChange = (e) => {
    setScore(parseFloat(e.target.value));
  };

  const handleGameChange = (e) => {
    const selectedGame = e.target.value;
    setGame(selectedGame);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = gameOptions.filter((game) =>
      game.toLowerCase().includes(searchTerm)
    );
    setFilteredOptions(filteredGames);
  };

  const axiosPostData = async () => {
    const postData = {
      username: user,
      game: game,
      score: score,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/rating",
        postData
      );
      setMessage(<p className="success">{response.data}</p>);
      setScore(5); // Reset the slider value after submitting
      setGame("");
    } catch (error) {
      console.error("Error posting rating:", error);
      setMessage(<p className="error">Failed to submit rating</p>);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!game || !score) {
      setMessage(<p className="required">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Rating</h1>
        {isGuest || !isAuthenticated ? (
          <p>You cannot submit ratings as a guest.</p>
        ) : (
          <form className="rating-form" onSubmit={handleSubmit}>
            <label>Game</label>
            <input
              type="text"
              id="game"
              name="game"
              value={game}
              onChange={handleGameChange}
              onInput={handleSearch}
              className="field"
              autoComplete="off"
              placeholder="Search for a game"
            />
            {filteredOptions.length > 0 && (
              <select
                id="game-dropdown"
                name="game-dropdown"
                value={game}
                onChange={handleGameChange}
                className="field"
              >
                <option value="" disabled>
                  Select a game
                </option>
                {filteredOptions.map((game, index) => (
                  <option key={index} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            )}
            <label>Score</label>
            <span className="score-display">{score}</span>
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
        {message}
      </div>
    </>
  );
}
