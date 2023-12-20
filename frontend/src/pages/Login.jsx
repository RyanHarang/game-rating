import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
        setMessage(<p className="success">{response.data.message}</p>);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage(<p className="error">{response.data.error}</p>);
      }
    } catch (error) {
      setMessage(
        <p className="error">Failed to log in. Check your credentials.</p>
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage(<p className="required">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  const handleGuest = () => {
    setMessage(<p className="message">Continuing as Guest</p>);
    setTimeout(() => {
      navigate("/home");
    }, 1000);
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
        <button type="submit">Login</button>
        <button type="button" onClick={handleGuest}>
          Continue as Guest
        </button>
      </form>
      {message}
    </>
  );
}
