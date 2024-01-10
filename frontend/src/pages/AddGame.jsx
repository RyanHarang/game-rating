import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function AddGame() {
  const { isGuest } = useAuth();
  const [title, setTitle] = useState("");
  const [site, setSite] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const axiosPostData = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("site", site);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:4000/requests/submit-request",
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
          <p>You can not add games as a guest.</p>
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
              onChange={(e) => setImage(e.target.files[0])}
              className="field"
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
