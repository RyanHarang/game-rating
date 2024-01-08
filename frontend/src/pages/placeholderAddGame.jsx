import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function AddGame() {
  const { isGuest } = useAuth();
  const [gamesList, setGamesList] = useState([]);
  const [filteredGamesList, setFilteredGamesList] = useState([]);
  const [title, setTitle] = useState("");
  const [site, setSite] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedGame, setSelectedGame] = useState("");
  const [updateGame, setUpdateGame] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSite, setNewSite] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/games");
        const games = response.data.map((game) => game.title);
        setGamesList(games);
        setFilteredGamesList(games);
      } catch (error) {
        console.error("Error fetching users and games:", error);
      }
    };
    fetchGames();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = gamesList.filter((game) =>
      game.toLowerCase().includes(searchTerm)
    );
    setFilteredGamesList(filteredGames);
  };

  const handleUpdateGameChange = (e) => {
    setSelectedGame(e.target.value);
    // setUpdateGame(selectedGame);
  };

  const axiosPostData = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("site", site);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:4000/games/upload-game",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTitle("");
      setSite("");
      setImage(null);
      setMessage(<p className="success">{response.data}</p>);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(<p className="error">{error.response.data}</p>);
      } else {
        setMessage(<p className="error">Failed to add game</p>);
      }
    }
  };

  const handleGameUpdate = async (e) => {
    e.preventDefault();
    if (!updateGame) {
      setMessage(<p className="required">Please select a game</p>);
      return;
    } else if (!newTitle && !newSite && !newImage) {
      setMessage(<p className="required">Please update an attribute</p>);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("site", newSite);
      formData.append("image", newImage);
      const response = await axios.put(
        `http://localhost:4000/games/${updateGame}`,
        formData
      );
      setUpdateGame("");
      setNewTitle("");
      setNewSite("");
      setNewImage(null);
      setUpdateMessage(<p className="success">{response.data}</p>);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !site || !image) {
      setMessage(<p className="required">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Add Game</h1>
        {isGuest ? (
          <p>You can not add games as a guest</p>
        ) : (
          <form className="game-form" onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field"
            />
            <label>Site</label>
            <input
              required
              type="text"
              id="site"
              name="site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="field"
            />
            <label>Image</label>
            <input
              required
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="field"
            />
            <button type="submit" className="process">
              Submit
            </button>
          </form>
        )}
        {message}
      </div>
      <div className="form-container">
        <h1 className="form-title">Update Game</h1>
        {isGuest ? (
          <p>You can not update games as a guest</p>
        ) : (
          <form className="game-form" onSubmit={handleGameUpdate}>
            <input
              type="text"
              name="game"
              placeholder="Search for a game"
              value={updateGame}
              onChange={(e) => setUpdateGame(e.target.value)}
              onInput={handleSearch}
              className="field"
            />
            <select
              value={selectedGame}
              onChange={handleUpdateGameChange}
              // onChange={(e) => setSelectedGame(e.target.value)}
              // onBlur={(e) => setUpdateGame(e.target.value)}
              className="field"
            >
              <option value="" disabled>
                Select a Game
              </option>
              {filteredGamesList.map((game, index) => (
                <option key={index} value={game}>
                  {game}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="newTitle">New Title:</label>
            <br />
            <input
              type="text"
              id="newTitle"
              name="newTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="field"
            />
            <br />
            <label htmlFor="newSite">New Site:</label>
            <br />
            <input
              type="text"
              id="newSite"
              name="newSite"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              className="field"
            />
            <br />
            <label htmlFor="newImage">New Image:</label>
            <br />
            <input
              type="file"
              id="newImage"
              name="newImage"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="field"
            />
            <br />
            <button type="submit" className="process">
              Update Game
            </button>
          </form>
        )}
        {updateMessage}
      </div>
    </>
  );
}
