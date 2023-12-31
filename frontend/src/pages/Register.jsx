import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        "http://localhost:4000/users/upload-user",
        postData
      );
      setMessage(
        <p className="success">
          {response.data}
          <br />
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      );
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(<p className="error">Username already exists</p>);
      } else {
        console.error("Error registering user:", error);
        setMessage(<p className="error">Failed to register</p>);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(<p className="error">Passwords do not match</p>);
      return;
    }
    if (username.length < 4 || username.length > 12) {
      setMessage(<p className="error">Username does not meet requirements</p>);
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(<p className="error">Password does not meet requirements</p>);
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
        <p className="message">
          Usernames must be between 4 and 12 characters long <br />
          Passwords must be at least 8 characters long and contain at least 1
          uppercase letter, 1 lowercase letter, 1 digit, and 1 special character
        </p>
        <button type="submit" className="process">
          Submit
        </button>
      </form>
      {message}
    </div>
  );
}
