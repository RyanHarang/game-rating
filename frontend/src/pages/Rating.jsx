import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie library

export default function Rating() {
  const [username, setUsername] = useState("");
  const [game, setGame] = useState("");
  const [score, setScore] = useState(5);
  const [error, setError] = useState("");

  const handleScoreChange = (e) => {
    setScore(parseFloat(e.target.value));
  };

  const axiosPostData = async () => {
    const postData = {
      username: username,
      game: game,
      score: score,
    };
    const authToken = Cookies.get("authToken"); // Use Cookies.get() instead of document.cookie

    try {
      await axios.post("http://localhost:4000/rating", postData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setError(<p className="success">Rating sent!</p>);
    } catch (error) {
      console.error("Error sending rating:", error);
      setError(<p className="error">Failed to send rating.</p>);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !game || !score) {
      setError(<p className="required">Please fill all fields.</p>);
    } else {
      setError("");
      axiosPostData();
    }
  };

  return (
    <>
      <h1>Rating</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Game</label>
        <input
          type="text"
          id="game"
          name="game"
          value={game}
          onChange={(e) => setGame(e.target.value)}
        />
        <label>Score</label>
        <select value={score} onChange={handleScoreChange}>
          <option>0</option>
          <option>0.5</option>
          <option>1</option>
          <option>1.5</option>
          <option>2</option>
          <option>2.5</option>
          <option>3</option>
          <option>3.5</option>
          <option>4</option>
          <option>4.5</option>
          <option>5</option>
          <option>5.5</option>
          <option>6</option>
          <option>6.5</option>
          <option>7</option>
          <option>7.5</option>
          <option>8</option>
          <option>8.5</option>
          <option>9</option>
          <option>9.5</option>
          <option>10</option>
        </select>
        {error}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
