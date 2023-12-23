import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const axiosPostData = async () => {
    const postData = {
      username,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/users", // https://game-rating-server.vercel.app/users
        postData
      );
      setMessage(<p className="success">{response.data}</p>);
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(
        <p className="error">Failed to register. Please try again.</p>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(<p className="error">Passwords do not match</p>);
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!?_\-*]+$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        <p className="error">
          Password must be at least 5 characters and contain letters and numbers
        </p>
      );
      return;
    }
    setMessage("");
    await axiosPostData();
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={handleUsernameChange}
          className="field"
          required
        />
        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="field"
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="field"
          required
        />
        <button type="submit" className="process">
          Submit
        </button>
      </form>
      {message}
    </div>
  );
}
