import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import "../css/Forms.css";
import axios from "axios";

export default function Rating() {
  const { isGuest, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameOptions, setGameOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [game, setGame] = useState("");
  const [score, setScore] = useState(5);
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
      setScore(5);
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
          <p>You can not submit ratings as a guest.</p>
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
            <div className="custom-select">
              <div className="score-display">
                <span>{score}</span>
              </div>
              <div className="select-options">
                {[...Array(21).keys()].map((value) => (
                  <div
                    key={value}
                    className="option"
                    onClick={() =>
                      handleScoreChange({ target: { value: value / 2 } })
                    }
                  >
                    {value / 2}
                  </div>
                ))}
              </div>
            </div>
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
