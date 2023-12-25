import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const axiosPostData = async () => {
    const postData = {
      username: username,
      password: password,
    };
    try {
      const response = await axios.post("http://localhost:4000/login");

      if (response.data.message) {
        login(response.data.user);
        setMessage(<p className="success">{response.data.message}</p>);
        setTimeout(() => {
          navigate("/list");
        }, 1000);
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

  const handleGuest = () => {
    setMessage(<p className="message">Continuing as Guest</p>);
    loginAsGuest();
    setTimeout(() => {
      navigate("/list");
    }, 1000);
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
          <button
            type="button"
            className="process guest-login"
            onClick={handleGuest}
          >
            Continue as Guest
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
