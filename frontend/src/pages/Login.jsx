import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [username, password]);

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
        setAuth(true);
        navigate("/");
      } else {
        setError(<p className="error">{response.data.error}</p>);
      }
      console.log(JSON.stringify(response?.data));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(<p className="error">{error.response.data.error}</p>);
      } else {
        setError(<p className="error">Failed to log in</p>);
      }
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
      {error}
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          required
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="field"
        />
        <label>Password</label>
        <input
          required
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
