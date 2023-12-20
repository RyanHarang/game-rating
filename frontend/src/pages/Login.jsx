import React, { useState } from "react";
import axios from "axios";

export default function Login() {
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
        setError(<p className="success">{response.data.message}</p>);
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
      </form>
    </>
  );
}
