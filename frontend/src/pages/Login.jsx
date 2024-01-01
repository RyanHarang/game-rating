import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const axiosPostData = async () => {
    const postData = {
      username: username,
      password: password,
    };
    try {
      setMessage(<p className="loading">Logging in...</p>);
      const response = await axios.post(
        "http://localhost:4000/users/login",
        postData
      );
      if (response.data.message) {
        login(response.data.user);
        setMessage(<p className="success">{response.data.message}</p>);
        setTimeout(() => {
          navigate("/list");
        }, 600);
      } else {
        setMessage(<p className="error">{response.data.error}</p>);
      }
    } catch (error) {
      setMessage(<p className="error">Failed to log in</p>);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage(<p className="required">Please fill all fields</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            className="field"
          />
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
          <button type="submit" className="process">
            Login
          </button>
          <button type="button" className="process logout" onClick={logout}>
            Logout
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
