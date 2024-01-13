import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import AdminHeader from "../components/AdminHeader";
import axios from "axios";

export default function AdminUpdate() {
  const { isAdmin } = useAuth();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [title, setTitle] = useState("");
  const [site, setSite] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchGames();
    }
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get("http://localhost:4000/games/all-games");
      setGames(response.data);
      setFilteredGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleGameSelect = (e) => {
    setSelectedGame(e.target.value);
    setTitle(e.target.value);
  };

  const handleTitleChange = (e) => {
    const enteredTitle = e.target.value;
    setTitle(enteredTitle);
    const filtered = games.filter((game) =>
      game.title.toLowerCase().includes(enteredTitle.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGame) {
      setMessage(<p className="required">Please select a game</p>);
      return;
    }
    if (!newTitle && !image && !site) {
      setMessage(<p className="required">Please update a field</p>);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("site", site);
      formData.append("image", image);
      const response = await axios.put(
        `http://localhost:4000/games/${selectedGame}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(<p>{response.data}</p>);
      setTitle("");
      setSite("");
      setImage(null);
      setSelectedGame("");
      setFilteredGames(games);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  if (!isAdmin) {
    return <p>Only an admin can access this page</p>;
  }
  return (
    <>
      <AdminHeader />
      <div className="form-container">
        <h1 className="form-title">Update Game</h1>
        <form onSubmit={handleFormSubmit} className="update-form">
          <label>Select Game:</label>
          <br />
          <select
            value={selectedGame}
            onChange={handleGameSelect}
            className="field"
          >
            <option value="">Select a Game</option>
            {filteredGames.map((game) => (
              <option key={game._id} value={game.title}>
                {game.title}
              </option>
            ))}
          </select>
          <br />
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="field"
            required
          />
          <label>New Title:</label>
          <br />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="field"
          />
          <label>Site:</label>
          <br />
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="field"
          />
          <label>Image:</label>
          <br />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="field"
          />
          <button type="submit" className="process">
            Update Game
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
