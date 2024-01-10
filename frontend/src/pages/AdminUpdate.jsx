import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import AdminHeader from "../components/AdminHeader";
import axios from "axios";

export default function AdminUpdate() {
  const { isAdmin } = useAuth();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
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
      const response = await axios.get("http://localhost:4000/games");
      setGames(response.data);
      setFilteredGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleGameSelect = (e) => {
    setSelectedGame(e.target.value);
    setTitle(e.target.value);
    // Optionally, you can set the title and site fields based on the selected game
    // const selectedGameData = games.find(
    //   (game) => game.title === e.target.value
    // );
    // if (selectedGameData) {
    //   setTitle(selectedGameData.title);
    // }
  };

  const handleTitleChange = (e) => {
    const enteredTitle = e.target.value;
    setTitle(enteredTitle);
    // Filter the games based on the entered title
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
    if (!title && !image && !site) {
      setMessage(<p className="required">Please update a field</p>);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
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
      // console.log(response.data);
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
        <h1 className="form-title">Update Games</h1>
        <form onSubmit={handleFormSubmit} className="update-form">
          <div>
            <label>Select Game:</label>
            <select
              value={selectedGame}
              onChange={handleGameSelect}
              className="field"
            >
              <option value="" className="field">
                Select a Game
              </option>
              {filteredGames.map((game) => (
                <option key={game._id} value={game.title}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Title:</label>
            <br />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="field"
              required
            />
          </div>
          <div>
            <label>Site:</label>
            <br />
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label>Image:</label>
            <br />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="field"
            />
          </div>
          <button type="submit" className="process">
            Update Game
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
