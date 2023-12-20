import React, { useState } from "react";
import axios from "axios";

export default function AddGame() {
  const [title, setTitle] = useState("");
  const [site, setSite] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const axiosPostData = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("site", site);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:4000/games",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(<p className="success">{response.data}</p>);
    } catch (error) {
      setMessage(<p className="error">Failed to add game</p>);
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
        {message}
      </div>
    </>
  );
}
