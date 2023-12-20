import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const axiosPostData = async () => {
    const postData = {
      username: username,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        postData
      );

      if (response.data.message) {
        login(response.data.user);
        setError(<p className="success">{response.data.message}</p>);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(<p className="error">{response.data.error}</p>);
      }
    } catch (error) {
      setError(
        <p className="error">Failed to log in. Check your credentials.</p>
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError(<p className="required">Please fill all fields.</p>);
    } else {
      setError("");
      axiosPostData();
    }
  };

  const handleGuest = () => {
    // Handle logic for continuing as a guest
    navigate("/home");
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error}
        <button type="submit">Login</button>
        <button type="button" onClick={handleGuest}>
          Continue as Guest
        </button>
      </form>
    </>
  );
}
