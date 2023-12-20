import React, { useEffect, useState } from "react";
import "../css/forms.css";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let processing = true;
    return () => {
      processing = false;
    };
  }, []);

  const axiosPostData = async () => {
    const postData = {
      username: username,
      password: password,
    };
    await axios
      .post("http://localhost:4000/users", postData)
      .then((res) => setMessage(<p className="success">{res.data}</p>));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage(<p className="error">Please fill all fields.</p>);
    } else {
      setMessage("");
      axiosPostData();
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="process">
            Submit
          </button>
        </form>
        {message}
      </div>
    </>
  );
}
