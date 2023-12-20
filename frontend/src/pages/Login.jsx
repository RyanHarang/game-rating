import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

// IMPORTANT
// One way to potentially handle the login is to simply not render the Header component from the login page
// and have the 'Submit' button link to the home page if the username & password meet the set requirements.
// This probably wouldn't solve any issues relating to user accounts and people being able to rate things
// from their account, so something like JWT would probably still be needed in addition to the above logic
// to allow for user authetication.

export default function Login() {
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
